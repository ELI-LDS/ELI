import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { packInfo, validatePackage } from '../../scripts/check-package.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const work = join(root, '.artifacts/packaging');
await rm(work, { recursive: true, force: true });
await mkdir(work, { recursive: true });

// 실제 배포 대상의 tarball과 파일 목록을 먼저 확인해요.
const info = packInfo(join(root, 'packages/ui'), work);
await validatePackage(join(root, 'packages/ui'), info);
assert.equal((await stat(join(work, info.filename))).size, info.size);

// 실제 tarball을 비공개 소비 앱에 설치해 공개 API와 CSS 연결을 확인해요.
const consumer = join(work, 'consumer');
await mkdir(consumer);
await writeFile(join(consumer, 'package.json'), JSON.stringify({ name: 'eli-private-consumer', private: true, type: 'module' }));
execFileSync('npm', ['install', '--offline', '--ignore-scripts', '--legacy-peer-deps', '--no-audit', '--no-fund', '--package-lock=false', join(work, info.filename)], { cwd: consumer, stdio: 'inherit' });
await writeFile(join(consumer, 'index.html'), '<html><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>');
await writeFile(join(consumer, 'main.tsx'), `import { createRoot } from 'react-dom/client';
import { Button } from '@eli/ui/button';
import { Modal } from '@eli/ui/modal';
import { SnackBar } from '@eli/ui/snackbar';
import { Toggle } from '@eli/ui/toggle';
createRoot(document.getElementById('root')!).render(<><Button size="large">버튼</Button><Button backgroundColor="#153464" icon={null} width="100%">커스텀 버튼</Button><Modal height={320} positiveAction="확인" secondaryAction="취소" width={480} /><SnackBar actionColor="#153464" /><Toggle aria-label="알림 설정" defaultChecked /></>);
`);
await writeFile(join(consumer, 'tsconfig.json'), JSON.stringify({ extends: join(root, 'tsconfig.base.json'), compilerOptions: { noEmit: true }, include: ['main.tsx'] }));
execFileSync(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '-p', join(consumer, 'tsconfig.json')], { stdio: 'inherit' });
await build({ root: consumer, configFile: false, logLevel: 'warn', build: { minify: true } });
const assets = join(consumer, 'dist/assets');
const files = await readdir(assets);
const css = (await Promise.all(files.filter(x => x.endsWith('.css')).map(x => readFile(join(assets, x), 'utf8')))).join('\n');
const js = (await Promise.all(files.filter(x => x.endsWith('.js')).map(x => readFile(join(assets, x), 'utf8')))).join('\n');
assert.match(css, /\.eli-button/);
assert.match(css, /\.eli-dim/);
assert.match(css, /\.eli-typo-heading-h4/);
assert.match(css, /\.eli-snackbar/);
assert.match(css, /\.eli-toggle/);
assert.match(css, /\.eli-typo-body-medium/);
assert.match(css, /\.eli-typo-label-large/);
assert.match(css, /--eli-color-blue-500:/);
assert.match(js, /커스텀 버튼/);
assert.match(js, /내용을 작성합니다/);
assert.match(js, /제목/);
assert.match(js, /메세지를 작성합니다\./);
assert.match(js, /액션/);
assert.match(await readFile(join(consumer, 'dist/index.html'), 'utf8'), /rel="stylesheet"/);
const bundle = { jsBytes: Buffer.byteLength(js), cssBytes: Buffer.byteLength(css), note: '개발 검증 예제와 React DOM을 포함한 Vite 번들이에요. ELI 단독 다운로드 크기가 아니에요.' };
await writeFile(join(work, 'consumer-bundle.json'), JSON.stringify(bundle, null, 2));
console.log('패키지 파일·실제 tarball·소비자 타입·Button·Modal·SnackBar·Toggle CSS와 토큰 자동 연결 검증을 통과했어요.');
console.log('브라우저 확인 대상: .artifacts/packaging/consumer');
