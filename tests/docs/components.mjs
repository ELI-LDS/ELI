import { componentPages } from '../../apps/docs/frontend/features/docs-catalog/catalog.ts';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit, expect } from '@playwright/test';

const root = fileURLToPath(new URL('../../', import.meta.url));
const work = join(root, '.artifacts/docs-overlays');
await mkdir(work, { recursive: true });
const routes = componentPages.map(page => page.id);
const probe = createServer();
await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
const server = spawn(process.execPath, [join(root, 'node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], { cwd: join(root, 'apps/docs'), stdio: 'ignore' });
const base = `http://127.0.0.1:${port}`;
const browsers = process.env.DOCS_BROWSERS?.split(',') ?? ['chromium', 'webkit'];
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if ((await fetch(`${base}/components/button`)).ok) break; } catch { /* 서버 준비를 기다려요. */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  for (const route of routes) {
    const response = await fetch(`${base}/components/${route}`);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    for (const text of ['기본 사용', '설치', '전체 속성']) assert.ok(html.includes(text), `${route}: ${text}`);
    assert.ok(!html.includes('푸터에 보통 뭐쓰냐'));
    assert.ok(!html.includes('03. 프로퍼티'));
    if (route !== 'divider') assert.ok(html.includes('예시'));
  }
  assert.equal((await fetch(`${base}/components/not-a-component`)).status, 404);
  for (const name of browsers) {
    const browser = await (name === 'webkit' ? webkit : chromium).launch(name === 'chrome' ? { channel: 'chrome' } : {});
    try {
      const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}/components/button`);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toHaveText('Button');
      const variant = page.locator('[data-prop="variant"]');
      await expect(variant.locator('.doc-api__default')).toHaveText("'solid'");
      assert.equal(Math.round((await page.locator('#docs-main').boundingBox()).width), 720);
      await expect(page.getByRole('button', { name: '검색 · 준비 중' })).toBeDisabled();
      await page.screenshot({ path: join(work, `${name}-button-desktop.png`), fullPage: true });
      await page.goto(`${base}/components/chip`);
      const gender = page.getByRole('button', { name: '성별', exact: true });
      await gender.click();
      const filter = page.getByRole('dialog', { name: '필터', exact: true });
      await expect(filter).toBeVisible();
      await expect(page.locator('.docs-overlay:not([hidden]) .docs-overlay__backdrop')).toHaveCSS('background-color', /rgba\(2, 8, 18, 0\.4\)|color\(srgb/);
      assert.ok((await filter.boundingBox()).x > 0);
      await page.screenshot({ path: join(work, `${name}-filter-desktop.png`) });
      await page.getByRole('button', { name: '필터 닫기' }).click();
      await expect(filter).toBeHidden();
      await page.setViewportSize({ width: 375, height: 812 });
      await gender.click();
      await expect(filter).toBeVisible();
      await expect(filter).toHaveCSS('animation-duration', '0.2s');
      await expect(filter).toHaveCSS('animation-timing-function', 'ease-out');
      await expect(filter).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
      const geometry = await filter.boundingBox();
      assert.equal(Math.round(geometry.width), 375);
      assert.equal(Math.round(geometry.y + geometry.height), 812);
      await page.getByRole('radio', { name: '여성', exact: true }).check();
      await page.screenshot({ path: join(work, `${name}-filter-mobile.png`) });
      await page.getByRole('button', { name: '필터 닫기' }).click();
      await expect(filter).toBeHidden();
      await expect(page.getByRole('button', { name: '여성', exact: true })).toBeFocused();
      await page.getByRole('button', { name: '여성', exact: true }).click();
      await expect(page.getByRole('radio', { name: '여성', exact: true })).toBeChecked();
      await page.keyboard.press('Escape');
      await expect(filter).toBeHidden();

      const menuButton = page.getByRole('button', { name: '메뉴 열기' });
      await menuButton.click();
      const menu = page.getByRole('dialog', { name: '모바일 문서 메뉴' });
      await expect(menu).toBeVisible();
      await expect(menu).toHaveCSS('animation-duration', '0.4s');
      await expect(menu).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
      await page.keyboard.press('Shift+Tab');
      assert.ok(await menu.evaluate(element => element.contains(document.activeElement)));
      const menuBox = await menu.boundingBox();
      assert.equal(Math.round(menuBox.width), 375); assert.equal(Math.round(menuBox.height), 812);
      await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
      await menu.getByRole('button', { name: 'Foundation', exact: true }).click();
      await menu.getByRole('button', { name: 'Typography', exact: true }).click();
      await expect(page).toHaveURL(/foundation\/typography$/);
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await page.getByRole('button', { name: '메뉴 열기' }).click();
      await page.getByRole('dialog').getByRole('button', { name: 'Components', exact: true }).click();
      await page.screenshot({ path: join(work, `${name}-menu-mobile.png`) });
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: '메뉴 열기' })).toBeFocused();

      await page.getByRole('button', { name: '검색 열기' }).click();
      const search = page.getByRole('dialog', { name: '문서 검색' });
      await expect(search).toBeVisible();
      const searchOverlay = page.locator('.docs-search-overlay:not([hidden])');
      await expect(searchOverlay).toHaveCSS('animation-duration', '0.25s');
      // 열림 도중의 투명도를 최종 화면으로 오인하지 않도록 전환 완료도 확인해요.
      await expect(searchOverlay).toHaveCSS('opacity', '1');
      const input = page.getByRole('searchbox', { name: '컴포넌트 검색' });
      await expect(input).toBeFocused();
      await input.fill('내비');
      await expect(search.getByRole('button', { name: 'Navigation Bar', exact: true })).toBeVisible();
      await expect(search.getByRole('button', { name: 'Navigation Bar Glass', exact: true })).toBeVisible();
      await page.screenshot({ path: join(work, `${name}-search-results.png`) });
      await input.fill('캘린더');
      await expect(page.getByText('검색 결과가 없어요.')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(search).toBeHidden();
      await expect(page.getByRole('button', { name: '검색 열기' })).toBeFocused();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.getByRole('button', { name: '메뉴 열기' }).click();
      assert.ok(await page.getByRole('dialog').evaluate(element => parseFloat(getComputedStyle(element).animationDuration)) < 0.001);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
      for (const route of routes) {
        await page.goto(`${base}/components/${route}`);
        await expect(page.locator('h1')).toBeVisible();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name} ${route}: 페이지 가로 넘침`);
        const assets = await page.locator('img:visible').evaluateAll(elements => elements.map(element => ({ src: element.getAttribute('src'), loaded: element.complete && element.naturalWidth > 0, width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })));
        assert.ok(assets.every(asset => asset.src?.startsWith('/assets/') && asset.loaded && asset.width > 0 && asset.height > 0), `${name} ${route}: 로컬 에셋`);
      }
      assert.deepEqual(errors, []);
      console.log(`${name}: ${routes.length}개 문서·모바일 메뉴/검색·필터 Dim/모달/바텀시트·포커스·모션 통과`);
    } finally { await browser.close(); }
  }
  const lock = JSON.parse(await readFile(join(root, 'apps/docs/.eli/lock.json'), 'utf8'));
  await writeFile(join(work, 'result.json'), JSON.stringify({ pages: routes, browsers, uiVersion: lock.version, realDevices: false, edgeApp: false }, null, 2));
} finally { server.kill('SIGTERM'); }
