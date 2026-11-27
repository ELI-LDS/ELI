import assert from 'node:assert/strict';
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, preview } from 'vite';
import { chromium, webkit } from '@playwright/test';
import { materialize } from './fixtures.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const work = join(root, '.artifacts/registry-fonts');
await rm(work, { recursive: true, force: true });
const { files } = await materialize(join(root, '.artifacts/registry'), join(work, 'ui'), ['button', 'modal']);
await mkdir(join(work, 'public'), { recursive: true });
await writeFile(join(work, 'public/existing-pretendard.woff2'), files.get('font/PretendardVariable.woff2'));
await writeFile(join(work, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
await writeFile(join(work, 'index.html'), '<html lang="ko"><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>');
await writeFile(join(work, 'main.tsx'), `
import { createRoot } from 'react-dom/client';
import { Button } from './ui/button';
const mode = new URL(location.href).searchParams.get('font');
if (mode !== 'default') {
  // 앱에서 이미 연결한 웹폰트가 있는 상황을 재현해요. ELI CSS는 변경하지 않아요.
  const family = mode.startsWith('variable') ? 'Pretendard Variable' : 'Pretendard';
  const existing = new FontFace(family, 'url("/existing-pretendard.woff2")', { weight: '100 900', display: 'swap' });
  document.fonts.add(mode.endsWith('loading') ? existing : await existing.load());
}
createRoot(document.getElementById('root')!).render(<Button icon={null}>한글과 ELI 123</Button>);
`);
await build({ root: work, configFile: false, logLevel: 'error', build: { minify: true } });
const assets = await readdir(join(work, 'dist/assets'));
const fonts = assets.filter(path => path.endsWith('.woff2'));
assert.equal(fonts.length, 1, '여러 UI를 설치해도 기본 폰트 asset은 하나예요.');
const server = await preview({
  root: work, configFile: false, logLevel: 'error', preview: { host: '127.0.0.1', port: 0 },
  plugins: [{ name: 'existing-font-delay', configurePreviewServer(server) {
    server.middlewares.use((request, _response, next) => {
      if (request.url?.startsWith('/existing-pretendard.woff2')) setTimeout(next, 150);
      else next();
    });
  } }],
});
try {
  const url = server.resolvedUrls.local[0];
  for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await engine.launch({ headless: true });
    try {
      for (const mode of ['default', 'variable', 'pretendard', 'variable-loading', 'pretendard-loading']) {
        const context = await browser.newContext();
        try {
          const page = await context.newPage();
          page.setDefaultTimeout(15_000);
          console.log(`${name}: ${mode} 확인 중`);
          const requests = [];
          const errors = [];
          page.on('request', request => { if (request.url().includes('.woff2')) requests.push(new URL(request.url()).pathname); });
          page.on('pageerror', error => errors.push(error.message));
          await page.goto(`${url}?font=${mode}`);
          await page.getByRole('button', { name: '한글과 ELI 123' }).waitFor();
          await page.evaluate(async () => Promise.race([document.fonts.ready, new Promise((_, reject) => setTimeout(() => reject(new Error(JSON.stringify([...document.fonts].map(font => ({ family: font.family, status: font.status }))))), 15_000))]));
          const stack = await page.getByText('한글과 ELI 123', { exact: true }).evaluate(element => getComputedStyle(element).fontFamily);
          assert.ok(stack.indexOf('Pretendard Variable') < stack.indexOf('_eli-pretendard-variable'));
          assert.ok(stack.indexOf('Pretendard,') < stack.indexOf('_eli-pretendard-variable'));
          if (mode === 'default') {
            // OS에 Pretendard가 설치돼 있어도 함께 제공한 원본이 실제로 디코딩되는지 확인해요.
            if (!requests.some(path => path.startsWith('/assets/'))) await page.evaluate(async path => {
              const font = new FontFace('ELI 원본 파일 검증', `url("${path}")`, { weight: '100 900', display: 'swap' });
              document.fonts.add(await font.load());
              if (!document.fonts.check('600 16px "ELI 원본 파일 검증"', '한글 ELI')) throw new Error('동봉 폰트를 읽지 못했어요.');
            }, `/assets/${fonts[0]}`);
            assert.equal(requests.filter(path => path.startsWith('/assets/')).length, 1);
          } else {
            assert.deepEqual(requests, ['/existing-pretendard.woff2'], '기존 웹폰트가 글자를 제공하면 동봉 파일을 추가 로딩하지 않아요.');
          }
          assert.deepEqual(errors, []);
        } finally { await context.close(); }
      }
      console.log(`${name}: Pretendard Variable 원본 로딩·기존 Variable/Pretendard 이름 우선·추가 요청 방지 통과`);
    } finally { await browser.close(); }
  }
} finally { await new Promise(resolve => server.httpServer.close(resolve)); }
