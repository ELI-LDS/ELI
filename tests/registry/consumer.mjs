import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { mkdir, readFile, readdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import net from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { chromium } from '@playwright/test';
import { materialize as restoreFiles, selectFiles } from './fixtures.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const registry = join(root, '.artifacts/registry');
const work = join(root, '.artifacts/registry-consumer');
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const index = JSON.parse(await readFile(join(registry, 'registry.json'), 'utf8'));
await rm(work, { recursive: true, force: true });

/** 같은 소비 시나리오를 JSON 복원과 실제 설치 도구 양쪽에 적용해요. */
async function materialize(source, destination, requested) {
  if (!process.argv.includes('--cli')) return restoreFiles(source, destination, requested);
  const project = dirname(destination);
  await mkdir(project, { recursive: true });
  await writeFile(join(project, 'package.json'), JSON.stringify({ private: true, type: 'module', dependencies: { react: manifest.devDependencies.react } }));
  const cli = join(root, 'packages/cli/dist/cli.mjs');
  for (const args of [
    ['init', '--registry', source, '--dir', 'eli'],
    ['add', ...requested],
  ]) execFileSync(process.execPath, [cli, ...args, '--cwd', project, '--json'], { stdio: 'pipe' });
  const selected = await selectFiles(source, requested);
  for (const [path, content] of selected.files) assert.equal(await readFile(join(destination, path), 'utf8'), content);
  return selected;
}

// 소비 프로젝트는 JSON에 든 소스만 복원하고 @eli-design/ui를 설치하지 않아요.
const vite = join(work, 'vite');
const all = await materialize(registry, join(vite, 'eli'), index.items.filter(item => item.kind === 'component').map(item => item.id));
await writeFile(join(vite, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
const exports = [...all.selected.values()].filter(item => item.kind === 'component').map(item => `export { ${item.entry.export} } from './eli/${item.entry.path.replace(/\.tsx$/, '')}';`).join('\n');
await writeFile(join(vite, 'components.ts'), exports);
await writeFile(join(vite, 'main.tsx'), `import * as components from './components';\ndocument.body.textContent = Object.keys(components).join(',');\n`);
await writeFile(join(vite, 'index.html'), '<html lang="ko"><body><script type="module" src="./main.tsx"></script></body></html>');
await writeFile(join(vite, 'assets.d.ts'), "declare module '*.css';\n");
await writeFile(join(vite, 'tsconfig.json'), JSON.stringify({ extends: join(root, 'tsconfig.base.json'), compilerOptions: { noEmit: true }, include: ['**/*.ts', '**/*.tsx'] }));
execFileSync(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '-p', join(vite, 'tsconfig.json')], { stdio: 'inherit' });
await build({ root: vite, configFile: false, logLevel: 'error', build: { minify: true } });
const cssDirectory = join(vite, 'dist/assets');
const css = (await Promise.all((await readdir(cssDirectory)).filter(file => file.endsWith('.css')).map(file => readFile(join(cssDirectory, file), 'utf8')))).join('\n');
for (const selector of ['.eli-button', '.eli-modal', '.eli-select', '.eli-fab-menu', '.eli-text-field', '--eli-color-blue-500:', '@layer components']) assert.ok(css.includes(selector), selector);
console.log(`선택 설치 소스 ${index.items.filter(item => item.kind === 'component').length}개 전체의 타입·Vite·CSS 연결 검증을 통과했어요.`);

const next = join(work, 'next');
await materialize(registry, join(next, 'eli'), ['modal', 'select', 'fab-menu', 'loading-indicator', 'text-field', 'text-area', 'badge', 'slider', 'radio']);
await mkdir(join(next, 'app'), { recursive: true });
await mkdir(join(next, 'node_modules'), { recursive: true });
for (const dependency of ['react', 'react-dom', 'next']) await symlink(await realpath(join(root, 'node_modules', dependency)), join(next, 'node_modules', dependency), 'junction');
await writeFile(join(next, 'package.json'), JSON.stringify({ private: true, dependencies: Object.fromEntries(['react', 'react-dom', 'next'].map(name => [name, manifest.devDependencies[name]])) }));
await writeFile(join(next, 'next.config.mjs'), 'export default { reactStrictMode: true };\n');
await writeFile(join(next, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', lib: ['dom', 'esnext'], module: 'esnext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, skipLibCheck: true, esModuleInterop: true, resolveJsonModule: true, isolatedModules: true, plugins: [{ name: 'next' }] }, include: ['**/*.ts', '**/*.tsx', '.next/types/**/*.ts'], exclude: ['node_modules'] }));
await writeFile(join(next, 'app/layout.tsx'), 'export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="ko"><body>{children}</body></html>; }');
await writeFile(join(next, 'app/client.tsx'), `'use client';
import { useState } from 'react';
import { Button } from '../eli/button/Button/Button';
import { Select } from '../eli/select/Select/Select';
import { FabMenu } from '../eli/fab/FabMenu/FabMenu';
export function Client() {
  const [count, setCount] = useState(0);
  return <><Button onClick={() => setCount(count + 1)}>소스 버튼 {count}</Button><Select label="소스 선택" options={[{ label: '소스 옵션', value: 'first' }]} /><FabMenu items={[{ id: 'first', label: '소스 액션' }]} /></>;
}`);
await writeFile(join(next, 'app/page.tsx'), `import { Client } from './client';
import { Badge } from '../eli/badge/Badge/Badge';
import { Modal } from '../eli/modal/Modal/Modal';
import { LoadingIndicator } from '../eli/loading/LoadingIndicator/LoadingIndicator';
import { TextField } from '../eli/text/TextField/TextField';
import { TextArea } from '../eli/text/TextArea/TextArea';
import { Slider } from '../eli/slider/Slider/Slider';
import { Radio } from '../eli/radio/Radio/Radio';
export default function Page() { return <main><h1>ELI 소스 설치 검증</h1><Badge>서버 배지</Badge><Modal title="소스 모달" style={{ display: 'none' }} /><LoadingIndicator aria-label="소스 진행" /><TextField /><TextArea /><Slider aria-label="소스 값" /><Radio aria-label="소스 라디오" value="first" /><Client /></main>; }`);
const nextBin = join(root, 'node_modules/next/dist/bin/next');
const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1' };
execFileSync(process.execPath, [nextBin, 'build'], { cwd: next, env, stdio: 'inherit' });
async function collectCss(directory) {
  let result = '';
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result += await collectCss(path);
    else if (entry.name.endsWith('.css')) result += await readFile(path, 'utf8');
  }
  return result;
}
const nextCss = await collectCss(join(next, '.next/static'));
for (const selector of ['.eli-button', '.eli-modal', '.eli-dim', '.eli-select', '.eli-menu-item', '.eli-fab-menu', '--eli-color-blue-500:']) assert.ok(nextCss.includes(selector), selector);

const port = await new Promise((resolve, reject) => {
  const server = net.createServer();
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => { const port = server.address().port; server.close(error => error ? reject(error) : resolve(port)); });
});
const server = spawn(process.execPath, [nextBin, 'start', '-H', '127.0.0.1', '-p', String(port)], { cwd: next, env, stdio: 'pipe' });
let logs = '';
server.stdout.on('data', data => { logs += data; });
server.stderr.on('data', data => { logs += data; });
server.on('error', error => { logs += error.message; });
let browser;
try {
  const url = `http://127.0.0.1:${port}`;
  let html;
  for (let attempt = 0; attempt < 150; attempt++) {
    try { const response = await fetch(url); if (response.ok) { html = await response.text(); break; } } catch { /* 서버 시작을 기다려요. */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(html, logs);
  assert.match(html, /서버 배지/);
  assert.match(html, /소스 모달/);
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && /hydration|Minified React error|didn't match|does not match/i.test(message.text())) errors.push(message.text()); });
  await page.goto(url);
  await page.getByRole('button', { name: '소스 버튼 0' }).click();
  await page.getByRole('button', { name: '소스 버튼 1' }).waitFor();
  await page.getByRole('button', { name: /소스 선택/ }).click();
  await page.getByRole('option', { name: '소스 옵션' }).click();
  await page.getByRole('button', { name: /소스 선택 소스 옵션/ }).waitFor();
  assert.deepEqual(errors, []);
  console.log('선택 설치 JSON만으로 Next.js 빌드·SSR·hydration·Button/Select 상호작용·CSS 연결을 검증했어요.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
