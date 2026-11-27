import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { mkdir, readFile, readdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import net from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { chromium } from '@playwright/test';
import { apiContractsFixture, apiContractsTypes, publicApiTypeAssertions } from '../browser/api-contracts-fixture.mjs';
import { checkApiContracts } from '../browser/api-contracts.mjs';
import { checkTextField } from '../browser/text-field.mjs';
import { textFieldFixture } from '../browser/text-field-fixture.mjs';
import { checkModal } from '../browser/modal.mjs';
import { modalFixture } from '../browser/modal-fixture.mjs';
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
  // 릴리스 검증에서는 다시 빌드하지 않고 최종 tarball에 든 실행 파일과 공개 콘텐츠를 그대로 사용해요.
  const cli = process.env.ELI_CLI_BINARY ?? join(root, 'packages/cli/dist/cli.mjs');
  for (const args of [
    ['init', '--registry', process.env.ELI_REGISTRY_URL ?? source, '--dir', 'ui'],
    ['add', ...requested],
  ]) execFileSync(process.execPath, [cli, ...args, '--cwd', project, '--json'], { stdio: 'pipe' });
  const selected = await selectFiles(source, requested);
  for (const [path, content] of selected.files) assert.deepEqual(await readFile(join(destination, path)), Buffer.from(content));
  return selected;
}

// 소비 프로젝트는 JSON에 든 소스만 복원하고 @eli-design/ui를 설치하지 않아요.
const vite = join(work, 'vite');
const all = await materialize(registry, join(vite, 'ui'), index.items.filter(item => item.kind === 'component').map(item => item.id));
await writeFile(join(vite, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
const exports = [...all.selected.values()].filter(item => item.kind === 'component').map(item => `export { ${item.entry.export} } from './ui/${item.entry.path.replace(/\.tsx$/, '')}';`).join('\n');
await writeFile(join(vite, 'components.ts'), exports);
const publicNames = [...all.selected.values()].filter(item => item.kind === 'component').map(item => item.entry.export);
await writeFile(join(vite, 'api-types.tsx'), `import { ${publicNames.join(', ')} } from './components';\n` + publicApiTypeAssertions(publicNames));
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
await materialize(registry, join(next, 'ui'), ['modal', 'select', 'fab', 'navigation-drawer', 'loading-indicator', 'text-field', 'text-area', 'badge', 'slider', 'radio', 'checkbox', 'segment-control', 'navigation-bar', 'navigation-bar-glass', 'progress-indicator', 'divider', 'snack-bar']);
await mkdir(join(next, 'app'), { recursive: true });
await mkdir(join(next, 'node_modules'), { recursive: true });
for (const dependency of ['react', 'react-dom', 'next']) await symlink(await realpath(join(root, 'node_modules', dependency)), join(next, 'node_modules', dependency), 'junction');
await writeFile(join(next, 'package.json'), JSON.stringify({ private: true, dependencies: Object.fromEntries(['react', 'react-dom', 'next'].map(name => [name, manifest.devDependencies[name]])) }));
await writeFile(join(next, 'next.config.mjs'), 'export default { reactStrictMode: true };\n');
await writeFile(join(next, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', lib: ['dom', 'esnext'], module: 'esnext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, skipLibCheck: true, esModuleInterop: true, resolveJsonModule: true, isolatedModules: true, plugins: [{ name: 'next' }] }, include: ['**/*.ts', '**/*.tsx', '.next/types/**/*.ts'], exclude: ['node_modules'] }));
await writeFile(join(next, 'app/layout.tsx'), 'export const metadata = { title: "ELI 소스 소비 검증" }; export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="ko"><body>{children}</body></html>; }');
await writeFile(join(next, 'app/client.tsx'), `'use client';
import { useCallback, useRef, useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { TextField } from '../ui/text-field';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { FabMenu } from '../ui/fab-menu';
import { NavigationDrawer } from '../ui/navigation-drawer';
import { NavigationDrawerCategory } from '../ui/navigation-drawer-category';
import { NavigationDrawerMenu } from '../ui/navigation-drawer-menu';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { Radio } from '../ui/radio';
import { TextArea } from '../ui/text-area';
import { SegmentControl } from '../ui/segment-control';
import { NavigationBar } from '../ui/navigation-bar';
import { NavigationBarGlass } from '../ui/navigation-bar-glass';
import { LoadingIndicator } from '../ui/loading-indicator';
import { ProgressIndicator } from '../ui/progress-indicator';
import { Divider } from '../ui/divider';
import { SnackBar } from '../ui/snack-bar';
${modalFixture}
${textFieldFixture}
${apiContractsFixture}
${apiContractsTypes}
export function Client() {
  const [modalTest, setModalTest] = useState(false);
  const [apiTest, setApiTest] = useState(false);
  const [textTest, setTextTest] = useState(false);
  useEffect(() => { setApiTest(location.search.includes('api-contracts')); setModalTest(location.search.includes('modal')); setTextTest(location.search.includes('text-field')); }, []);
  const [count, setCount] = useState(0);
  if (apiTest) return <ApiContractsFixture />;
  if (modalTest) return <ModalFixture />;
  if (textTest) return <TextFieldFixture />;
  return <><Button onClick={() => setCount(count + 1)}>소스 버튼 {count}</Button><Select label="소스 선택" options={[{ label: '소스 옵션', value: 'first' }]} /><NavigationDrawer aria-label="소스 Drawer"><NavigationDrawerCategory label="문서" /><NavigationDrawerMenu label="소스 메뉴" value="main" subItems={[{ label: "소스 하위", value: "sub" }]} /></NavigationDrawer><FabMenu label="소스 추가" items={[{ id: 'first', label: '소스 액션' }]} /></>;
}`);
await writeFile(join(next, 'app/page.tsx'), `import { Client } from './client';
import { Badge } from '../ui/badge';
import { Modal } from '../ui/modal';
import { LoadingIndicator } from '../ui/loading-indicator';
import { TextField } from '../ui/text-field';
import { TextArea } from '../ui/text-area';
import { Slider } from '../ui/slider';
import { Radio } from '../ui/radio';
export default function Page() { return <main><h1>ELI 소스 설치 검증</h1><Badge>서버 배지</Badge><Modal open={false} title="소스 모달" style={{ display: 'none' }} /><LoadingIndicator aria-label="소스 진행" /><TextField /><TextArea /><Slider aria-label="소스 값" /><Radio aria-label="소스 라디오" value="first" /><Client /></main>; }`);
const nextBin = join(root, 'node_modules/next/dist/bin/next');
await mkdir(join(next, 'app/existing-font'), { recursive: true });
await writeFile(join(next, 'app/existing-font/layout.tsx'), `import localFont from 'next/font/local';
import './font.css';
const font = localFont({ src: '../../ui/font/PretendardVariable.woff2', variable: '--app-pretendard' });
export default function Layout({ children }: { children: React.ReactNode }) { return <section className={font.variable} data-existing-font>{children}</section>; }`);
await writeFile(join(next, 'app/existing-font/font.css'), '[data-existing-font] { --eli-font-family-sans: var(--app-pretendard); }');
await writeFile(join(next, 'app/existing-font/page.tsx'), `import { Button } from '../../ui/button';
export default function Page() { return <Button icon={null}>기존 Next 폰트</Button>; }`);
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
  assert.doesNotMatch(html, /class="eli-modal"/);
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && /hydration|Minified React error|didn't match|does not match/i.test(message.text())) errors.push(message.text()); });
  await page.goto(url);
  await page.getByRole('button', { name: '소스 버튼 0' }).click();
  await page.getByRole('button', { name: '소스 버튼 1' }).waitFor();
  await page.getByRole('button', { name: /소스 선택/ }).click();
  await page.getByRole('option', { name: '소스 옵션' }).click();
  await page.getByRole('button', { name: /소스 선택 소스 옵션/ }).waitFor();
  await page.getByRole('button', { name: '소스 메뉴', exact: true }).click();
  await page.getByRole('button', { name: '소스 하위', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: '소스 하위', exact: true }).getAttribute('aria-current'), 'page');
  await page.getByRole('button', { name: '소스 추가', exact: true }).click();
  await page.getByRole('button', { name: '소스 액션', exact: true }).click();
  await checkModal(page, url);
  await checkTextField(page, url);
  await checkApiContracts(page, url);
  // Next/font의 별칭은 추측하지 않고 앱이 연결한 CSS 변수를 그대로 사용해요.
  const existing = await browser.newContext();
  try {
    const fontPage = await existing.newPage();
    const requests = [];
    fontPage.on('request', request => { if (request.url().includes('.woff2')) requests.push(request.url()); });
    await fontPage.goto(`${url}/existing-font`);
    await fontPage.getByRole('button', { name: '기존 Next 폰트' }).waitFor();
    await fontPage.evaluate(() => document.fonts.ready);
    const family = await fontPage.getByText('기존 Next 폰트', { exact: true }).evaluate(element => getComputedStyle(element).fontFamily);
    assert.ok(family.length > 0 && !family.includes('_eli-pretendard-variable'));
    assert.equal(requests.length, 1, '기존 Next 폰트만 로딩하고 ELI 대체 파일은 추가 요청하지 않아요.');
  } finally { await existing.close(); }
  assert.deepEqual(errors, []);
  console.log('선택 설치 JSON만으로 Next.js 빌드·SSR·hydration·Button/Select/FAB/Drawer 상호작용·CSS 연결을 검증했어요.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
