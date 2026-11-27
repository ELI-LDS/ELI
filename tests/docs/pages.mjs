import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { chromium, webkit, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { componentPages } from '../../apps/docs/frontend/features/docs-catalog/catalog.ts';
import { getDocPage } from '../../apps/docs/frontend/pages/components/data/getDocPage.ts';

const root = resolve('.');
const work = join(root, '.artifacts/docs-pages');
await mkdir(work, { recursive: true });
const probe = createServer();
await new Promise(done => probe.listen(0, '127.0.0.1', done));
const port = probe.address().port;
await new Promise(done => probe.close(done));
const server = spawn(process.execPath, [join(root, 'node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], { cwd: join(root, 'apps/docs'), stdio: 'ignore' });
const url = `http://127.0.0.1:${port}`;
const targets = process.env.DOCS_BROWSERS?.split(',') ?? ['chromium', 'webkit'];
const results = [];

/** 실제 문서에 연결된 제어 상태가 입력·선택·닫힘 결과를 다시 표시하는지 확인해요. */
async function checkExamples(page, id) {
  const example = name => page.locator(`section[aria-labelledby="example-${name}"]`);
  const controlled = () => example('controlled');
  const checks = {
    checkbox: async () => { const input = controlled().getByRole('checkbox'); await input.check(); await expect(input).toBeChecked(); },
    chip: async () => {
      const chip = page.locator('section[aria-labelledby="usage"]').getByRole('button', { name: '디자인', exact: true });
      await chip.click(); await expect(chip).toHaveAttribute('aria-pressed', 'true');
      await example('remove').getByRole('button', { name: '디자인 삭제', exact: true }).click();
      await expect(example('remove').getByRole('button', { name: '다시 표시', exact: true })).toBeVisible();
    },
    fab: async () => { const menu = example('menu'); await menu.getByRole('button', { name: '추가', exact: true }).click(); await menu.getByRole('button', { name: '사진 추가', exact: true }).click(); await expect(menu.getByRole('button', { name: '추가', exact: true })).toHaveAttribute('aria-expanded', 'false'); },
    'navigation-bar': async () => { const item = controlled().getByRole('button', { name: '검색', exact: true }); await item.click(); await expect(item).toHaveAttribute('aria-current', 'page'); },
    'navigation-drawer': async () => { const drawer = page.locator('section[aria-labelledby="usage"]'); const main = drawer.getByRole('button', { name: '학습', exact: true }); await main.click(); await expect(main).toHaveAttribute('aria-expanded', 'true'); const sub = drawer.getByRole('button', { name: '내 강의', exact: true }); await sub.click(); await expect(sub).toHaveAttribute('aria-current', 'page'); },
    radio: async () => { const input = controlled().getByRole('radio', { name: '개발', exact: true }); await input.check(); await expect(input).toBeChecked(); },
    'segment-control': async () => { const option = controlled().getByRole('radio', { name: '격자', exact: true }); await option.click(); await expect(option).toBeChecked(); },
    select: async () => { const root = controlled(); await root.getByRole('button').first().click(); await root.getByRole('option', { name: '디자인', exact: true }).click(); await expect(root.getByRole('button').first()).toContainText('디자인'); },
    slider: async () => { const input = controlled().getByRole('slider'); await input.focus(); await input.press('ArrowRight'); await expect(input).toHaveValue('55'); },
    'snack-bar': async () => { const root = example('open'); await root.getByRole('button', { name: '스낵바 띄우기', exact: true }).click(); await expect(root.locator('.eli-snackbar')).toBeVisible(); await root.getByRole('button', { name: '닫기', exact: true }).click(); await expect(root.locator('.eli-snackbar')).toHaveCount(0); },
    tab: async () => { const root = example('panels'); await root.getByRole('tab', { name: '2번 탭', exact: true }).click(); await expect(root.getByRole('tabpanel')).toContainText('2번 탭을 누르면'); },
    'text-area': async () => { const input = controlled().getByRole('textbox'); await input.fill('소개를 작성해요.'); await expect(input).toHaveValue('소개를 작성해요.'); },
    'text-field': async () => { const root = controlled(); await root.getByRole('textbox').fill('hello@example.com'); await root.getByRole('button', { name: '입력 내용 지우기' }).click(); await expect(root.getByRole('textbox')).toHaveValue(''); },
    toggle: async () => { const input = controlled().getByRole('switch'); await input.click(); await expect(input).toBeChecked(); },
    tooltip: async () => { const root = example('trigger'); const trigger = root.getByRole('button', { name: '마우스를 올려보세요' }); await trigger.focus(); await expect(root.getByRole('tooltip')).toBeVisible(); await trigger.press('Escape'); await expect(root.getByRole('tooltip')).toHaveCount(0); },
  };
  await checks[id]?.();
}
try {
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(`${url}/components/button`)).ok) break; } catch { /* 서버 준비를 기다려요. */ }
    await new Promise(done => setTimeout(done, 100));
  }
  for (const target of targets) {
    const browser = await (target === 'webkit' ? webkit : chromium).launch(target === 'chrome' ? { channel: 'chrome' } : {});
    try {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
      // 브라우저별 클립보드 권한 UI 대신 앱이 전달하는 실제 복사 원문과 실패 피드백을 검증해요.
      await context.addInitScript(() => {
        window.__copies = [];
        window.__copyFailure = false;
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => {
          if (window.__copyFailure) throw new Error('권한 거절');
          window.__copies.push(text);
        } } });
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const { id } of componentPages) {
        const document = getDocPage(id);
        const response = await page.goto(`${url}/components/${id}`);
        assert.ok(response.ok());
        const html = await response.text();
        for (const text of [document.name, document.summary, '기본 사용', '설치', document.referenceHeading.title]) assert.ok(html.includes(text));
        await page.evaluate(() => document.fonts.ready);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(document.name);
        const bodyWidth = (await page.locator('.doc-page').boundingBox()).width;
        assert.ok(bodyWidth > 0 && bodyWidth <= 720, '본문은 목차에 남은 폭 안에서 최대 720px로 표시해요.');
        assert.equal(Math.round((await page.locator('.docs-shell').boundingBox()).width), 1280);
        assert.equal(await page.getByRole('link', { name: /storybook/i }).count(), 0);
        const rail = page.locator('.docs-shell__sidebar-scroll');
        await expect(rail).toHaveCSS('position', 'fixed');
        await expect(rail).toHaveCSS('scrollbar-width', 'none');
        const railBefore = await rail.boundingBox();
        await page.locator('#api').scrollIntoViewIfNeeded();
        const railAfter = await rail.boundingBox();
        assert.deepEqual(railAfter, railBefore, '본문을 스크롤해도 탐색 영역의 위치와 높이는 유지해요.');
        await rail.evaluate(element => { element.scrollTop = element.scrollHeight; });
        assert.ok(await rail.evaluate(element => element.scrollTop) > 0);
        await rail.evaluate(element => { element.scrollTop = 0; });

        await expect(page.locator('.doc-api').first().locator('[data-prop]')).toHaveCount(document.api.props.length);
        const references = page.locator('.doc-api');
        await expect(references).toHaveCount(1 + document.related.length);
        for (const reference of await references.all()) {
          await expect(reference).toBeVisible();
          assert.equal(await reference.locator('[data-prop]').last().getAttribute('data-prop'), 'className');
          assert.ok(await reference.locator('[data-prop]').evaluateAll(elements => elements.every(element => getComputedStyle(element).borderBottomWidth === '0px')));
        }
        for (const group of document.exampleGroups) for (const example of group.examples) {
          const heading = page.locator(`#example-${example.id}`);
          await expect(heading).toHaveText(example.title);
          if (group.id !== 'examples') await expect(heading).toHaveCSS('font-size', '20px');
        }
        const basic = page.locator('section[aria-labelledby="usage"]');
        await expect(basic.getByRole('button', { name: '코드 보기', exact: true })).toHaveCount(`${document.importCode}\n\n${document.examples[0].code}`.split('\n').length > 6 ? 1 : 0);
        await basic.getByRole('button', { name: '기본 사용 핵심 코드 복사', exact: true }).click();
        assert.equal(await page.evaluate(() => window.__copies.at(-1)), `${document.importCode}\n\n${document.examples[0].code}`);
        await page.evaluate(() => { window.__copyFailure = true; });
        await basic.getByRole('button', { name: '기본 사용 핵심 코드 복사', exact: true }).click();
        await expect(basic.getByText('복사하지 못했어요. 코드를 선택해 복사해주세요.')).toBeVisible();
        await page.evaluate(() => { window.__copyFailure = false; });
        const installation = page.locator('section[aria-labelledby="installation"]');
        const installIds = document.installationIds.join(' ');
        await installation.getByRole('tab', { name: 'pnpm', exact: true }).click();
        await installation.getByRole('button', { name: '컴포넌트 추가 명령 복사', exact: true }).click();
        assert.equal(await page.evaluate(() => window.__copies.at(-1)), `pnpm dlx eli-design@latest add ${installIds}`);
        await installation.getByRole('tab', { name: 'pnpm', exact: true }).press('ArrowRight');
        await expect(installation.getByRole('tab', { name: 'yarn', exact: true })).toBeFocused();
        await expect(installation.locator('details, .docs-code-block__number')).toHaveCount(0);
        await expect(installation.locator('p')).toHaveCount(0);
        await expect(installation.locator('.doc-terminal code')).toHaveText(`yarn dlx eli-design@latest add ${installIds}`);
        await installation.getByRole('tab', { name: 'Bun', exact: true }).click();
        await installation.getByRole('button', { name: '컴포넌트 추가 명령 복사', exact: true }).click();
        assert.equal(await page.evaluate(() => window.__copies.at(-1)), `bunx eli-design@latest add ${installIds}`);
        if (document.hasToc) {
          const link = page.locator('.doc-toc--sidebar a[href="#api"]');
          await expect(link).toBeVisible();
          await link.click();
          // 짧은 문서는 API를 96px까지 올릴 수 없어 페이지 끝에서 이동이 완료돼요.
          await expect.poll(() => page.evaluate(() => Math.abs(document.getElementById('api').getBoundingClientRect().top - 96) < 2 || Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY) < 2)).toBe(true);
          const atBottom = await page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY) < 2);
          if (atBottom) await expect(page.locator('.doc-toc--sidebar a').last()).toHaveAttribute('aria-current', 'location');
          else await expect(link).toHaveAttribute('aria-current', 'location');
          const top = (await page.locator('#api').boundingBox()).y;
          assert.ok(top >= 64 && top < 1000, `${id}: 앵커가 헤더 아래 화면 안에 위치해요: ${top}`);
        } else await expect(page.getByRole('navigation', { name: '이 페이지 목차' })).toHaveCount(0);
        await page.goto(`${url}/components/${id}`);
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: join(work, `${target}-${id}-desktop.png`) });
        await checkExamples(page, id);
        if (id === 'button') {
          await page.locator('section[aria-labelledby="example-click"]').getByRole('button', { name: '저장', exact: true }).click();
          await expect(page.locator('section[aria-labelledby="example-click"]').getByRole('button', { name: '저장됨', exact: true })).toBeVisible();
          const states = page.locator('section[aria-labelledby="example-disabled"]').getByRole('button', { name: '저장', exact: true });
          await expect(states).toHaveCount(2);
          await expect(states.first()).toBeEnabled();
          await expect(states.last()).toBeDisabled();
        }
        if (id === 'modal') {
          const opener = basic.getByRole('button', { name: '모달 열기', exact: true });
          await opener.click();
          const dialog = page.getByRole('dialog', { name: '제목', exact: true });
          await expect(dialog.getByRole('button', { name: '취소', exact: true })).toBeFocused();
          await page.keyboard.press('Shift+Tab');
          await expect(dialog.getByRole('button', { name: '확인', exact: true })).toBeFocused();
          await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
          assert.ok(await page.locator('.eli-modal').evaluate(element => Number(getComputedStyle(element).zIndex)) > 10);
          await page.keyboard.press('Escape');
          await expect(dialog).toBeHidden();await expect(opener).toBeFocused();
          await opener.click();
          await dialog.getByText('제목', { exact: true }).click();
          await expect(dialog).toBeVisible();
          await page.locator('.eli-modal .eli-dim').click({ position: { x: 4, y: 4 } });
          await expect(dialog).toBeHidden();await expect(opener).toBeFocused();
          await opener.click();await dialog.getByRole('button', { name: '취소', exact: true }).click();await expect(dialog).toBeHidden();
          const actions = page.locator('section[aria-labelledby="example-actions"]');
          await actions.getByRole('button', { name: '모달 열기', exact: true }).click();
          await page.getByRole('dialog').getByRole('button', { name: '완료', exact: true }).click();
          await expect(actions.getByRole('button', { name: '완료됨', exact: true })).toBeFocused();
          const full = basic.locator('details').filter({ has: page.locator('summary', { hasText: '전체 실행 예시' }) });
          await full.locator(':scope > summary').click();
          await expect(full.getByRole('region', { name: '기본 사용 전체 코드' })).toBeVisible();
        }
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto(`${url}/components/${id}`);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${id}: 모바일 가로 넘침`);
        if (document.hasToc) {
          await expect(page.locator('.doc-toc--sidebar')).toBeHidden();
          await expect(page.getByRole('navigation', { name: '이 페이지 목차' })).toHaveCount(0);
          await expect(page.locator('.doc-toc--inline')).toHaveCount(0);
        }
        const api = page.locator('.doc-api').first();
        await expect(api.locator('[data-prop]')).toHaveCount(document.api.props.length);
        for (const prop of await api.locator('.doc-api__name > code').all()) {
          assert.ok(await prop.evaluate(element => element.getBoundingClientRect().height <= parseFloat(getComputedStyle(element).lineHeight) * 1.1), '속성 이름은 한 줄로 읽어요.');
        }
        await page.goto(`${url}/components/${id}`);
        await page.screenshot({ path: join(work, `${target}-${id}-mobile.png`) });
        const axe = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
        assert.deepEqual(axe.violations.filter(issue => ['critical', 'serious'].includes(issue.impact)).map(issue => ({ id: issue.id, targets: issue.nodes.map(node => node.target) })), []);
        await page.setViewportSize({ width: 1440, height: 1000 });
      }
      // 새 문서의 첫 프레임부터 상단이어야 하며, 목차용 smooth가 페이지 전환에 새면 안 돼요.
      await page.goto(`${url}/components/button`);
      await page.evaluate(() => {
        window.scrollTo({ top: 2000, behavior: 'instant' });
        window.__documentFrames = [];
        const sample = () => {
          if (document.querySelector('.doc-intro h1')?.textContent === 'Badge') window.__documentFrames.push(scrollY);
          window.__documentFrame = requestAnimationFrame(sample);
        };
        window.__documentFrame = requestAnimationFrame(sample);
      });
      assert.ok(await page.evaluate(() => scrollY) > 0);
      await page.locator('.docs-shell__sidebar').getByRole('button', { name: 'Badge', exact: true }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Badge');
      await expect.poll(() => page.evaluate(() => window.__documentFrames.length)).toBeGreaterThan(0);
      assert.ok(await page.evaluate(() => window.__documentFrames.every(y => y === 0)), '새 문서는 상단으로 애니메이션하지 않고 처음부터 맨 위에 표시해요.');
      await page.evaluate(() => cancelAnimationFrame(window.__documentFrame));
      const ssr = await browser.newContext({ javaScriptEnabled: false });
      const first = await ssr.newPage();await first.goto(`${url}/components/button`);
      await expect(first.getByRole('heading', { name: 'Button', exact: true })).toBeVisible();
      await expect(first.getByRole('group', { name: 'Button 전체 속성', exact: true })).toBeVisible();await ssr.close();
      // 한국어는 검색 입력에만 쓰고 결과 이름에는 병기하지 않아요.
      await page.setViewportSize({ width: 375, height: 812 });await page.goto(`${url}/components/badge`);
      await page.getByRole('button', { name: '검색 열기' }).click();
      await page.getByRole('searchbox', { name: '컴포넌트 검색' }).fill('버튼');
      await expect(page.getByRole('dialog').getByRole('button', { name: 'Button', exact: true })).toBeVisible();
      assert.deepEqual(errors, []);
      results.push({ target, pages: componentPages.map(item => item.id), seriousAxeErrors: 0, realDevices: false });
      console.log(`${target}: ${componentPages.length}개 공통 문서·설치/복사·목차·실제 예시·모달·SSR·반응형 검증 통과`);
      await context.close();
    } finally { await browser.close(); }
  }
  await writeFile(join(work, 'result.json'), JSON.stringify(results, null, 2));
} finally { server.kill('SIGTERM'); }
