import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const root = fileURLToPath(new URL('../../', import.meta.url));
const work = join(root, '.artifacts/foundation');
await mkdir(work, { recursive: true });
const probe = createServer();
await new Promise((resolve, reject) => { probe.once('error', reject); probe.listen(0, '127.0.0.1', resolve); });
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
const server = spawn(process.execPath, [join(root, 'node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], { cwd: join(root, 'apps/docs'), stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
server.stdout.on('data', chunk => { output += chunk; });
server.stderr.on('data', chunk => { output += chunk; });
const url = `http://127.0.0.1:${port}`;
const targets = process.env.DOCS_BROWSERS?.split(',') ?? ['chromium', 'webkit'];
const contrastReview = [];

try {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if ((await fetch(`${url}/foundation/layout`)).ok) break; } catch { /* 서버 준비를 기다려요. */ }
    if (server.exitCode !== null) throw new Error(output);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  for (const [path, title] of [['color', 'Color'], ['typography', 'Typography'], ['layout', 'Layout']]) {
    const response = await fetch(`${url}/foundation/${path}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(`<title>${title} | ELI</title>`) && html.includes(title));
    assert.ok(!html.includes('푸터에 보통 뭐쓰냐') && !html.includes('저작권 어쩌구'));
  }
  for (const name of targets) {
    assert.ok(['chromium', 'webkit', 'chrome', 'edge'].includes(name));
    const browser = await (name === 'webkit' ? webkit : chromium).launch(name === 'chrome' ? { channel: 'chrome' } : name === 'edge' ? { channel: 'msedge' } : {});
    try {
      // JavaScript 없이도 제목·표·선택된 패널이 실제 첫 화면에 있는지 확인해요.
      const staticContext = await browser.newContext({ javaScriptEnabled: false });
      const staticPage = await staticContext.newPage();
      await staticPage.goto(`${url}/foundation/color?tab=semantic`);
      await expect(staticPage.getByRole('tab', { name: 'Semantic', exact: true })).toHaveAttribute('aria-selected', 'true');
      await expect(staticPage.getByRole('table', { name: 'Foreground 의미 색상' })).toBeVisible();
      await staticContext.close();

      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error' && !message.location().url.endsWith('/favicon.ico')) errors.push(message.text()); });
      await page.goto(`${url}/foundation/color`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const toc = page.getByRole('navigation', { name: '이 페이지 목차' });
      await expect(toc).toBeVisible();
      await expect(toc.getByRole('link', { name: 'Neutral', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Color', exact: true })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Primitive', exact: true })).toHaveAttribute('aria-selected', 'true');
      const neutral50 = page.locator('.foundation-palette__chip').filter({ hasText: 'Neutral-050' });
      const neutral75 = page.locator('.foundation-palette__chip').filter({ hasText: 'Neutral-075' });
      await expect(neutral50.locator('.foundation-palette__color')).toHaveCSS('background-color', 'rgb(244, 248, 254)');
      await expect(neutral75.locator('.foundation-palette__color')).toHaveCSS('background-color', 'rgb(239, 244, 251)');
      // 브라우저별 계산 색상 문자열 차이를 허용하되 흰색과 90% 알파는 동일하게 확인해요.
      await expect(page.locator('.docs-header')).toHaveCSS('background-color', /^(rgba\(255, 255, 255, 0\.9\)|color\(srgb 1 1 1 \/ 0\.9\))$/);
      assert.equal(Math.round((await page.locator('#docs-main').boundingBox()).width), 720);
      await page.screenshot({ path: join(work, `${name}-primitive-desktop.png`), fullPage: true });

      const rail = page.locator('.docs-shell__sidebar-scroll');
      const railBefore = await rail.boundingBox();
      const primitiveTab = page.getByRole('tab', { name: 'Primitive', exact: true });
      await primitiveTab.focus(); await primitiveTab.press('ArrowRight');
      await expect(page.getByRole('tab', { name: 'Semantic', exact: true })).toHaveAttribute('aria-selected', 'true');
      await expect(page).toHaveURL(/tab=semantic/);
      await expect(toc.getByRole('link', { name: 'Neutral', exact: true })).toHaveCount(0);
      await expect(toc.getByRole('link', { name: 'Foreground', exact: true })).toBeVisible();
      assert.deepEqual(await rail.boundingBox(), railBefore, '탭 전환으로 본문 높이가 바뀌어도 좌측 탐색은 유지해요.');
      await page.getByRole('tab', { name: 'Semantic', exact: true }).click();
      await expect(page.getByRole('tabpanel')).toHaveCount(1);
      await expect(page.getByRole('table', { name: 'Background 의미 색상' })).toContainText('Background/DefaultAlpha');
      await page.screenshot({ path: join(work, `${name}-semantic-desktop.png`), fullPage: true });
      await page.getByRole('tab', { name: 'Semantic', exact: true }).press('Home');
      await expect(primitiveTab).toHaveAttribute('aria-selected', 'true');
      await expect(toc.getByRole('link', { name: 'Blue', exact: true })).toBeVisible();
      await toc.getByRole('link', { name: 'Neutral', exact: true }).click();
      await expect.poll(() => page.evaluate(() => Math.abs(document.getElementById('primitive-neutral').getBoundingClientRect().top - 96) < 2)).toBe(true);
      await primitiveTab.press('End');
      await expect(page.getByRole('tab', { name: 'Semantic', exact: true })).toHaveAttribute('aria-selected', 'true');
      assert.equal(await page.evaluate(() => location.hash), '');

      await page.getByRole('button', { name: 'Typography', exact: true }).click();
      await expect(page).toHaveURL(/foundation\/typography$/);
      await expect(page.getByRole('heading', { name: 'Typography', exact: true })).toBeVisible();
      await expect(page.locator('[data-style="H1"]')).toHaveCSS('font-size', '56px');
      const h2Style = page.locator('[data-typography-style="H2"]');
      await expect(h2Style).toContainText('-1%');
      await expect(h2Style).toContainText('eli-typo-heading-h2');
      await expect(page.locator('.foundation-type-style')).toHaveCount(9);
      await page.screenshot({ path: join(work, `${name}-typography-desktop.png`), fullPage: true });
      await page.getByRole('button', { name: 'Foundation', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Typography', exact: true })).toBeHidden();
      await page.getByRole('button', { name: 'Foundation', exact: true }).click();
      await page.getByRole('button', { name: 'Layout', exact: true }).click();
      await expect(page).toHaveURL(/foundation\/layout$/);
      const bars = await page.locator('.foundation-scale__bar').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().width));
      assert.deepEqual(bars, [4, 8, 12, 16, 20, 24, 32, 48, 64]);
      await page.screenshot({ path: join(work, `${name}-layout-desktop.png`), fullPage: true });

      await page.setViewportSize({ width: 375, height: 812 });
      for (const [route, label] of [['color', 'primitive'], ['color?tab=semantic', 'semantic'], ['typography', 'typography'], ['layout', 'layout']]) {
        await page.goto(`${url}/foundation/${route}`, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator('.docs-shell__sidebar')).toBeHidden();
        await expect(page.getByRole('button', { name: '메뉴 열기' })).toBeVisible();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${name} ${label} 페이지 가로 넘침`);
        assert.equal(Math.round((await page.locator('#docs-main').boundingBox()).width), 343);
        if (label === 'typography') {
          await expect(page.locator('[data-style="H1"]')).toHaveCSS('font-size', '40px');
          await expect(page.locator('[data-typography-style="H2"] .foundation-type-metrics')).toBeVisible();
          assert.ok(await page.locator('.foundation-type-style').evaluateAll(elements => elements.every(element => element.scrollWidth <= element.clientWidth)));
        }
        if (label === 'semantic') {
          const table = page.getByRole('region', { name: 'Foreground 의미 색상 스크롤 영역' });
          await table.evaluate(element => { element.scrollLeft = 180; });
          assert.ok(await table.evaluate(element => element.scrollLeft) > 0);
          await table.evaluate(element => { element.scrollLeft = 0; });
        }
        await page.screenshot({ path: join(work, `${name}-${label}-mobile.png`), fullPage: true });
        const audit = await new AxeBuilder({ page }).analyze();
        await expect(page.getByRole('navigation', { name: '이 페이지 목차' })).toHaveCount(0);
        // 기존 비선택 탭과 공통 코드 줄 번호의 대비는 별도 검토 항목으로 기록해요.
        for (const issue of audit.violations.filter(item => item.id === 'color-contrast')) {
          for (const node of issue.nodes) {
            const knownDesign = await page.locator(node.target.join(' ')).evaluate(element => Boolean(element.closest('.foundation-color-tabs .eli-tab[data-active="false"], .docs-code-block__number')));
            assert.ok(knownDesign, `새 대비 오류를 확인해야 해요: ${node.target.join(' ')}`);
          }
          contrastReview.push({ browser: name, page: label, nodes: issue.nodes.map(node => node.target) });
        }
        assert.deepEqual(audit.violations.filter(item => item.id !== 'color-contrast' && ['critical', 'serious'].includes(item.impact)).map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })), []);
      }
      await page.setViewportSize({ width: 1440, height: 900 });
      for (const id of ['button', 'badge']) {
        await page.goto(`${url}/components/${id}`);
        const choices = page.locator('.doc-guidance__choices').first();
        await expect(choices).toHaveCSS('border-top-width', '0px');
        await expect(choices.locator('dl')).toHaveCSS('border-top-width', '1px');
        await expect(page.getByRole('navigation', { name: '이 페이지 목차' })).toBeVisible();
      }
      await page.goto(`${url}/components/drawer`);
      assert.ok(await page.locator('.docs-shell__toc').evaluate(element => element.scrollWidth <= element.clientWidth));
      assert.deepEqual(errors, []);
      console.log(`${name}: Foundation 4개 화면·SSR·탭 URL/키보드·Drawer 이동·375px 표 스크롤 통과`);
    } finally { await browser.close(); }
  }
  await writeFile(join(work, 'result.json'), JSON.stringify({ browsers: targets, realDevices: false, edgeApp: targets.includes('edge'), contrastReview }, null, 2));
} finally {
  server.kill('SIGTERM');
}
