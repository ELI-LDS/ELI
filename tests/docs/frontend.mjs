import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { cp, mkdir, readFile, readdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const root = fileURLToPath(new URL('../../', import.meta.url));
const docs = join(root, 'apps/docs');
const work = join(root, '.artifacts/docs-frontend');
const consumer = join(work, 'consumer');
const nextBin = join(root, 'node_modules/next/dist/bin/next');
const storyRoot = join(root, 'apps/storybook/storybook-static');
const servers = [];
const designContrast = [];

// 공개 페이지를 만들지 않고 실제 설치 소스를 Server Component에서 소비해요.
await rm(work, { recursive: true, force: true });
await mkdir(join(consumer, 'app'), { recursive: true });
await mkdir(join(consumer, 'node_modules'), { recursive: true });
await cp(join(docs, 'frontend'), join(consumer, 'frontend'), { recursive: true });
await mkdir(join(consumer, 'content/generated'), { recursive: true });
for (const path of ['query.ts', 'schema.ts', 'generated/data.ts']) {
  await cp(join(docs, 'content', path), join(consumer, 'content', path));
}
await cp(join(docs, 'public'), join(consumer, 'public'), { recursive: true });
for (const name of ['next', 'react', 'react-dom', 'pretendard', '@fontsource/geist-mono', 'refractor']) {
  await mkdir(resolve(consumer, 'node_modules', name, '..'), { recursive: true });
  await symlink(await realpath(join(docs, 'node_modules', name)), join(consumer, 'node_modules', name), 'junction');
}
await writeFile(join(consumer, 'package.json'), JSON.stringify({ private: true, name: 'eli-docs-ui-consumer' }));
await writeFile(join(consumer, 'tsconfig.json'), JSON.stringify({
  extends: '../../../tsconfig.base.json', compilerOptions: { noEmit: true, allowImportingTsExtensions: true, plugins: [{ name: 'next' }] },
  include: ['**/*.ts', '**/*.tsx', '.next/types/**/*.ts'], exclude: ['node_modules'],
}));
await writeFile(join(consumer, 'next.config.mjs'), `export default { turbopack: { root: ${JSON.stringify(root)} } };`);
await writeFile(join(consumer, 'app/layout.tsx'), `import '../frontend/shared/styles/site';
export const metadata = { title: '문서 UI 소비 검증' };
export default function Layout({children}: {children: React.ReactNode}) {
  return <html lang="ko"><body>{children}</body></html>;
}`);
const code = Array.from({ length: 15 }, (_, i) => `const line${i + 1} = ${JSON.stringify('긴 코드와 들여쓰기 검증 '.repeat(i === 0 ? 12 : 1))};`).join('\n');
await writeFile(join(consumer, 'app/page.tsx'), `import { Header } from '../frontend/layouts/Header/Header';
import { Footer } from '../frontend/layouts/Footer/Footer';
import { Table } from '../frontend/shared/ui/Table/Table';
import { CodeBlock } from '../frontend/features/code-block/CodeBlock';
export default function Page() {
  return <>
    <Header links={[{ label: '시작하기', href: '#start' }, { label: 'Foundation', href: '#foundation' }, { label: 'Components', href: '#components' }]} />
    <main><h1>문서 UI 소비 검증</h1>
      <CodeBlock code={${JSON.stringify(code)}} label="검증 코드" />
      <div style={{width:'100%', maxWidth:375}}><Table caption="검증 표" columns={${JSON.stringify(Array.from({ length: 6 }, (_, i) => ({ key: `col${i}`, label: `열 ${i}` })))}}
        rows={${JSON.stringify([{ id: 'first', cells: Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`col${i}`, `내용 ${i}`])) }])}} /></div>
    </main><Footer><p>서버 푸터 문구</p><p>두 번째 문구</p></Footer>
  </>;
}`);
try {
  execFileSync(process.execPath, [nextBin, 'build'], { cwd: consumer, stdio: 'inherit', timeout: 120_000 });
} catch (error) {
  await rm(consumer, { recursive: true, force: true });
  throw error;
}

async function listen(server) {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  servers.push(server);
  return `http://127.0.0.1:${server.address().port}`;
}
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff': 'font/woff', '.woff2': 'font/woff2' };
const storyUrl = await listen(createServer(async (request, response) => {
  try {
    const path = resolve(storyRoot, `.${decodeURIComponent(new URL(request.url, 'http://localhost').pathname)}`);
    assert.ok(path.startsWith(`${storyRoot}/`));
    response.setHeader('Content-Type', mime[extname(path)] ?? 'application/octet-stream');
    response.end(await readFile(path));
  } catch { response.writeHead(404); response.end(); }
}));
// 빈 포트에서 Next.js를 실행하고 검사 종료 시 서버를 정리해요.
const portProbe = createServer();
await new Promise(resolve => portProbe.listen(0, '127.0.0.1', resolve));
const port = portProbe.address().port;
await new Promise(resolve => portProbe.close(resolve));
const nextServer = spawn(process.execPath, [nextBin, 'start', '--hostname', '127.0.0.1', '--port', String(port)], { cwd: consumer, stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
nextServer.stdout.on('data', data => { output += data; });
nextServer.stderr.on('data', data => { output += data; });
const url = `http://127.0.0.1:${port}`;

try {
  let response;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { response = await fetch(url); if (response.ok) break; } catch { /* 서버 준비를 기다려요. */ }
    if (nextServer.exitCode !== null) throw new Error(output);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(response?.ok, output);
  const html = await response.text();
  for (const text of ['시작하기', '서버 푸터 문구', 'const line15', '검증 표']) assert.ok(html.includes(text), `초기 HTML에 ${text}가 있어야 해요.`);
  assert.match(html, /class="token keyword">const<\/span>/, '문법 강조도 첫 HTML에 포함해요.');

  const targets = process.env.DOCS_BROWSERS?.split(',') ?? ['chromium', 'webkit'];
  for (const target of targets) {
    const type = target === 'webkit' ? webkit : chromium;
    const browser = await type.launch(target === 'chrome' ? { channel: 'chrome' } : target === 'edge' ? { channel: 'msedge' } : {});
    try {
      const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error' && !message.location().url.endsWith('/favicon.ico')) errors.push(message.text()); });
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const initialAssets = await page.locator('img:visible').evaluateAll(elements => elements.map(element => ({ src: element.getAttribute('src'), loaded: element.complete && element.naturalWidth > 0, width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })));
      assert.ok(initialAssets.every(asset => asset.loaded));
      for (const [src, width, height] of [['/assets/eli-wordmark.svg', 61, 20], ['/assets/github.svg', 26.88, 26.25], ['/assets/search.svg', 24, 24]]) {
        const asset = initialAssets.find(asset => asset.src === src);
        assert.ok(asset && Math.abs(asset.width - width) < 0.1 && Math.abs(asset.height - height) < 0.1, src);
      }
      const fade = initialAssets.find(asset => asset.src === '/assets/code-fade.png');
      assert.ok(fade?.height === 55 && fade.width > 0);
      await expect(page.getByRole('navigation', { name: '주요 페이지' })).toBeVisible();
      const expand = page.getByRole('button', { name: '코드 보기' });
      const codeBlock = page.locator('.docs-code-block').first();
      const firstLine = codeBlock.locator('.docs-code-block__text').first();
      const beforeCodeX = (await firstLine.boundingBox()).x;
      await expect(codeBlock.locator('.token.keyword').first()).toBeVisible();
      await expect(codeBlock.locator('.token.string').first()).toBeVisible();
      assert.notEqual(await codeBlock.locator('.token.keyword').first().evaluate(element => getComputedStyle(element).color), await codeBlock.locator('.token.string').first().evaluate(element => getComputedStyle(element).color));
      await expand.focus();
      // 코드 영역의 위가 일부 가려져도 포커스 이동이 페이지를 다시 스크롤하지 않아야 해요.
      await codeBlock.evaluate(element => {
        document.body.style.minHeight = '200vh';
        window.scrollTo(0, element.getBoundingClientRect().top + scrollY + 20);
      });
      const beforeScrollY = await page.evaluate(() => scrollY);
      assert.ok(beforeScrollY > 0);
      await expand.press('Enter');
      const region = page.getByRole('region', { name: '검증 코드', exact: true });
      await expect(region).toBeFocused();
      assert.ok(Math.abs((await firstLine.boundingBox()).x - beforeCodeX) < 1, '펼쳐도 코드의 가로 위치를 유지해요.');
      assert.ok(Math.abs((await page.evaluate(() => scrollY)) - beforeScrollY) < 1, '펼쳐도 페이지 스크롤 위치를 유지해요.');
      await page.evaluate(() => document.body.style.removeProperty('min-height'));
      const dimensions = await region.evaluate(element => ({ height: element.clientHeight, line: parseFloat(getComputedStyle(element).lineHeight), scroll: element.scrollHeight, width: element.clientWidth, fullWidth: element.scrollWidth }));
      assert.ok(Math.abs(dimensions.height - dimensions.line * 10) <= 1, JSON.stringify(dimensions));
      assert.ok(dimensions.scroll > dimensions.height && dimensions.fullWidth > dimensions.width);
      await region.press('End');
      await expect.poll(() => region.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
      const scrollLayout = await region.evaluate(element => {
        element.scrollTop = element.scrollHeight;
        element.scrollLeft = element.scrollWidth;
        const viewport = element.getBoundingClientRect();
        const lastLine = element.querySelector('.docs-code-block__line:last-child').getBoundingClientRect();
        const block = element.closest('.docs-code-block');
        return {
          scrollbar: getComputedStyle(element).scrollbarWidth,
          horizontalScroll: element.scrollLeft,
          lastLineVisible: lastLine.bottom <= viewport.bottom + 1 && lastLine.top >= viewport.top,
          bottomPadding: parseFloat(getComputedStyle(block).paddingBottom),
          sidePadding: parseFloat(getComputedStyle(block).paddingLeft),
        };
      });
      assert.equal(scrollLayout.scrollbar, 'none');
      assert.ok(scrollLayout.horizontalScroll > 0 && scrollLayout.lastLineVisible, JSON.stringify(scrollLayout));
      assert.ok(scrollLayout.bottomPadding > scrollLayout.sidePadding);
      const tableScroll = page.getByRole('region', { name: '검증 표 스크롤 영역' });
      await tableScroll.evaluate(element => { element.scrollLeft = 180; });
      assert.ok(await tableScroll.evaluate(element => element.scrollLeft) > 0);
      await page.setViewportSize({ width: 375, height: 812 });
      await expect(page.getByRole('button', { name: '메뉴 열기' })).toBeVisible();
      await expect(page.getByRole('navigation', { name: '주요 페이지' })).toBeHidden();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
      const assets = await page.locator('img:visible').evaluateAll(elements => elements.map(element => ({ src: element.getAttribute('src'), loaded: element.complete && element.naturalWidth > 0, width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })));
      assert.ok(assets.length >= 3 && assets.every(asset => asset.loaded && asset.width > 0 && asset.height > 0));
      const fonts = await page.evaluate(() => ({ sans: document.fonts.check('400 16px "Pretendard Variable"', '문서'), mono: document.fonts.check('400 14px "Geist Mono"', 'const'), family: getComputedStyle(document.querySelector('.docs-footer')).fontFamily }));
      assert.ok(fonts.sans && fonts.mono && fonts.family.includes('Pretendard Variable'));
      const a11y = await new AxeBuilder({ page }).analyze();
      // 받은 디자인의 옅은 줄 번호·푸터 색상은 변경하지 않고 별도 검토 항목으로 남겨요.
      // 그 밖의 대비 오류를 허용하지 않도록 실제 해당 요소인지도 확인해요.
      for (const issue of a11y.violations.filter(item => item.id === 'color-contrast')) {
        for (const node of issue.nodes) {
          assert.ok(await page.locator(node.target.join(' ')).evaluate(element => Boolean(element.closest('.docs-footer, .docs-code-block__number'))));
        }
        designContrast.push({ browser: target, rule: issue.id, targets: issue.nodes.map(node => node.target) });
      }
      assert.deepEqual(a11y.violations.filter(item => item.id !== 'color-contrast' && ['critical', 'serious'].includes(item.impact)).map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), []);
      await page.screenshot({ path: join(work, `${target}-mobile.png`), fullPage: true });
      await page.setViewportSize({ width: 1200, height: 900 });
      await page.screenshot({ path: join(work, `${target}-desktop.png`), fullPage: true });

      // 각 Story가 로드되고 Controls가 전달하는 args가 실제 컴포넌트에 반영되는지 확인해요.
      const index = JSON.parse(await readFile(join(storyRoot, 'index.json'), 'utf8'));
      const entries = Object.values(index.entries).filter(entry => entry.title.startsWith('문서 웹사이트/'));
      assert.equal(entries.length, 10);
      for (const entry of entries) {
        await page.goto(`${storyUrl}/iframe.html?id=${entry.id}&viewMode=story`, { waitUntil: 'networkidle' });
        await expect(page.locator('#storybook-root > *').first()).toBeVisible();
        assert.equal(await page.locator('#error-message:visible').count(), 0);
      }
      const codeStory = entries.find(entry => entry.title.endsWith('/CodeBlock') && entry.name === '직접 바꿔보기');
      await page.goto(`${storyUrl}/iframe.html?id=${codeStory.id}&viewMode=story`, { waitUntil: 'networkidle' });
      await page.getByLabel('코드 편집').fill('수정한 코드');
      await expect(page.locator('.docs-code-block')).toContainText('수정한 코드');
      await page.goto(`${storyUrl}/iframe.html?id=${codeStory.id}&viewMode=story&args=language:css`, { waitUntil: 'networkidle' });
      await page.getByLabel('코드 편집').fill('.button { color: red; }');
      await expect(page.locator('.docs-code-block .token.property')).toHaveText('color');
      await page.goto(`${storyUrl}/iframe.html?id=${codeStory.id}&viewMode=story&args=defaultExpanded:true`, { waitUntil: 'networkidle' });
      await expect(page.locator('.docs-code-block')).toHaveAttribute('data-expanded', 'true');
      const footerStory = entries.find(entry => entry.title.endsWith('/Footer') && entry.name === '직접 바꿔보기');
      // Storybook URL args는 보안상 허용하는 ASCII 값을 사용해요. 한글 편집은 위 useArgs 편집기로 확인해요.
      await page.goto(`${storyUrl}/iframe.html?id=${footerStory.id}&viewMode=story&args=${encodeURIComponent('text:Updated footer;previewWidth:375')}`, { waitUntil: 'networkidle' });
      await expect(page.locator('.docs-footer')).toContainText('Updated footer');
      const headerStory = entries.find(entry => entry.title.endsWith('/Header') && entry.name === '직접 바꿔보기');
      await page.goto(`${storyUrl}/iframe.html?id=${headerStory.id}&viewMode=story`, { waitUntil: 'networkidle' });
      await page.getByRole('group', { name: '링크 1' }).getByLabel('문구').fill('수정한 링크');
      await expect(page.locator('.docs-header__navigation')).toContainText('수정한 링크');
      await page.getByRole('button', { name: '링크 추가', exact: true }).click();
      await expect(page.locator('.docs-header__navigation a')).toHaveCount(4);
      const tableStory = entries.find(entry => entry.title.endsWith('/Table') && entry.name === '직접 바꿔보기');
      await page.goto(`${storyUrl}/iframe.html?id=${tableStory.id}&viewMode=story`, { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: '열 추가' }).click();
      await expect(page.locator('.docs-table th')).toHaveCount(3);
      await page.getByRole('button', { name: '행 추가' }).click();
      await expect(page.locator('.docs-table tbody tr')).toHaveCount(4);
      const interaction = entries.find(entry => entry.title.endsWith('/Interactions') && entry.name === '직접 바꿔보기');
      await page.goto(`${storyUrl}/iframe.html?id=${interaction.id}&viewMode=story&args=kind:menu`, { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: '메뉴 열기' }).click();
      const menu = page.getByRole('dialog', { name: '모바일 문서 메뉴' });
      await expect(menu).toBeVisible();
      const frame = page.locator('.docs-interaction-story');
      assert.equal(Math.round((await menu.boundingBox()).height), await frame.evaluate(element => element.clientHeight));
      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
      await page.goto(`${storyUrl}/iframe.html?id=${interaction.id}&viewMode=story&args=kind:filter`, { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: '성별', exact: true }).click();
      const sheet = page.getByRole('dialog', { name: '필터', exact: true });
      await expect(sheet).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
      assert.equal(Math.round((await sheet.boundingBox()).width), await frame.evaluate(element => element.clientWidth));
      await page.keyboard.press('Escape');
      await expect(sheet).toBeHidden();
      assert.deepEqual(errors, [], `${target} 브라우저 오류`);
      console.log(`${target}: SSR·hydration·키보드·10줄·표 스크롤·폰트·에셋·Story 10개·프레임 오버레이 통과`);
    } finally { await browser.close(); }
  }
  const styles = [];
  async function collect(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      if (entry.isDirectory()) await collect(join(path, entry.name));
      else if (entry.name.endsWith('.css')) styles.push(await readFile(join(path, entry.name), 'utf8'));
    }
  }
  await collect(join(consumer, '.next/static'));
  assert.equal((styles.join('').match(/--eli-color-neutral-900:/g) ?? []).length, 1, '실제 페이지 CSS에서 공통 토큰 선언은 한 번만 제공해야 해요.');
  await writeFile(join(work, 'result.json'), JSON.stringify({ browsers: targets, storyCount: 10, ssr: true, tokenDefinitions: 1, realDevices: false, edgeApp: targets.includes('edge'), designContrast }, null, 2));
} finally {
  nextServer.kill('SIGTERM');
  await Promise.all(servers.map(server => new Promise(resolve => server.close(resolve))));
  // 소스 복제 검수 앱을 서비스나 추가 원본으로 남기지 않아요. 결과와 화면만 보존해요.
  await rm(consumer, { recursive: true, force: true });
}
