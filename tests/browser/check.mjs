import assert from 'node:assert/strict';
import { checkTextField } from './text-field.mjs';
import { checkModal } from './modal.mjs';
import { spawn } from 'node:child_process';
import net from 'node:net';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { chromium, devices, expect, firefox, webkit } from '@playwright/test';

const targetName = process.argv.find(argument => argument.startsWith('--target='))?.split('=')[1] ?? 'chromium';
const targets = {
  chromium: { browserType: chromium, desktop: true },
  chrome: { browserType: chromium, desktop: true, launchOptions: { channel: 'chrome' } },
  edge: { browserType: chromium, desktop: true, launchOptions: { channel: 'msedge' } },
  firefox: { browserType: firefox, desktop: true },
  webkit: { browserType: webkit, desktop: true },
  'android-chromium': { browserType: chromium, contextOptions: devices['Pixel 7'], desktop: false },
  'ios-webkit': { browserType: webkit, contextOptions: devices['iPhone 15'], desktop: false },
};
const target = targets[targetName];
assert.ok(target, `지원하지 않는 브라우저 검증 대상이에요: ${targetName}`);

const root = fileURLToPath(new URL('../../', import.meta.url));
const consumer = join(root, '.artifacts/packaging/consumer');
const viteBin = join(root, 'node_modules/vite/bin/vite.js');

async function availablePort() {
  return await new Promise((resolve, reject) => {
    const listener = net.createServer();
    listener.once('error', reject);
    listener.listen(0, '127.0.0.1', () => {
      const address = listener.address();
      assert.ok(address && typeof address !== 'string');
      const { port } = address;
      listener.close(error => error ? reject(error) : resolve(port));
    });
  });
}

const port = await availablePort();
const server = spawn(
  process.execPath,
  [viteBin, 'preview', consumer, '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] },
);
let serverOutput = '';
server.stdout.on('data', chunk => { serverOutput += chunk; });
server.stderr.on('data', chunk => { serverOutput += chunk; });

const browser = await target.browserType.launch(target.launchOptions);

try {
  const url = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Vite 미리보기 서버가 종료됐어요.\n${serverOutput}`);
    try {
      const response = await fetch(url);
      if (response.ok) break;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  const context = await browser.newContext(target.contextOptions);
  const page = await context.newPage();
  const browserErrors = [];
  page.on('console', message => {
    if (message.type() === 'error') browserErrors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', error => browserErrors.push(`pageerror: ${error.message}`));
  await page.goto(url, { waitUntil: 'networkidle' });

  const customButton = page.getByRole('button', { name: '커스텀 버튼', exact: true });
  assert.equal(await customButton.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(124, 58, 237)');
  if (target.desktop) {
    await customButton.hover();
    // Figma의 Hover 전환이 끝난 뒤 소비자 외부 CSS의 최종 계산값을 확인해요.
    await expect(customButton).toHaveCSS('background-color', 'rgb(109, 40, 217)');
    await page.mouse.down();
    // Pressed 전환은 100ms이므로 중간 보간값이 아닌 최종 상태를 비교해요.
    await expect(customButton).toHaveCSS('background-color', 'rgb(91, 33, 182)');
    await page.mouse.up();
  } else {
    await customButton.tap();
  }

  const disabledButton = page.getByRole('button', { name: '비활성 커스텀 버튼' });
  assert.equal(await disabledButton.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(196, 181, 253)');

  const checkbox = page.getByRole('checkbox', { name: '약관 동의' });
  assert.equal(await checkbox.isChecked(), true);
  if (target.desktop) await checkbox.press('Space');
  else await checkbox.tap();
  assert.equal(await checkbox.isChecked(), false);

  const frontendRadio = page.getByRole('radio', { name: '프론트엔드' });
  const backendRadio = page.getByRole('radio', { name: '백엔드' });
  assert.equal(await frontendRadio.isChecked(), true);
  assert.equal(await backendRadio.isChecked(), false);
  if (target.desktop) await backendRadio.click();
  else await backendRadio.tap();
  assert.equal(await frontendRadio.isChecked(), false);
  assert.equal(await backendRadio.isChecked(), true);
  const backendRadioIndicator = backendRadio.locator('xpath=following-sibling::*');
  await expect(backendRadioIndicator).toHaveCSS('opacity', '1');
  assert.equal(
    await backendRadio.evaluate(element => getComputedStyle(element).transitionDuration),
    '0.1s',
  );

  const toggle = page.getByRole('switch', { name: '알림 설정' });
  assert.equal(await toggle.getAttribute('aria-checked'), 'true');
  if (target.desktop) await toggle.click();
  else await toggle.tap();
  assert.equal(await toggle.getAttribute('aria-checked'), 'false');

  const navigationBar = page.getByRole('navigation', { name: '주요 탐색' });
  const navigationHome = navigationBar.getByRole('button', { name: '탐색 홈' });
  const navigationSearch = navigationBar.getByRole('button', { name: '탐색 검색' });
  assert.equal(await navigationHome.getAttribute('aria-current'), 'page');
  if (target.desktop) await navigationSearch.click();
  else await navigationSearch.tap();
  assert.equal(await navigationHome.getAttribute('aria-current'), null);
  assert.equal(await navigationSearch.getAttribute('aria-current'), 'page');
  // 색상 대비 기준선은 초기 소비 화면과 비교할 수 있도록 선택 상태를 되돌려요.
  if (target.desktop) await navigationHome.click();
  else await navigationHome.tap();

  const glassNavigation = page.getByRole('navigation', { name: '글래스 주요 탐색' });
  const glassHome = glassNavigation.getByRole('button', { name: '글래스 홈' });
  const glassSearch = glassNavigation.getByRole('button', { name: '글래스 검색' });
  assert.equal(await glassHome.getAttribute('aria-current'), 'page');
  if (target.desktop) {
    await glassHome.focus();
    await glassHome.press('ArrowRight');
    assert.equal(
      await glassSearch.evaluate(element => element === document.activeElement),
      true,
    );
    await glassSearch.press('Enter');
  } else {
    await glassSearch.tap();
  }
  assert.equal(await glassHome.getAttribute('aria-current'), null);
  assert.equal(await glassSearch.getAttribute('aria-current'), 'page');
  if (target.desktop) await glassHome.click();
  else await glassHome.tap();

  const navigationDrawer = page.getByRole('navigation', { name: '서비스 탐색' });
  const drawerHome = navigationDrawer.getByRole('button', { name: 'Drawer 홈' });
  const drawerSettings = navigationDrawer.getByRole('button', { name: 'Drawer 설정' });
  assert.equal(await drawerHome.getAttribute('aria-expanded'), 'true');
  const drawerSubItems = navigationDrawer.locator(
    '.eli-navigation-drawer-item__sub-items',
  ).first();
  assert.equal(
    await drawerSubItems.evaluate(element => getComputedStyle(element).transitionDuration),
    '0.2s, 0.2s, 0.2s, 0s',
  );
  if (target.desktop) await drawerHome.click();
  else await drawerHome.tap();
  assert.equal(await drawerHome.getAttribute('aria-expanded'), 'false');
  assert.equal(await drawerSubItems.getAttribute('aria-hidden'), 'true');
  if (target.desktop) await drawerHome.click();
  else await drawerHome.tap();
  assert.equal(await drawerHome.getAttribute('aria-expanded'), 'true');
  assert.equal(await drawerSubItems.getAttribute('aria-hidden'), 'false');
  if (target.desktop) await drawerSettings.click();
  else await drawerSettings.tap();
  assert.equal(await drawerSettings.getAttribute('aria-current'), 'page');
  const drawerSubItem = navigationDrawer.getByRole('button', { name: 'Drawer 하위 메뉴' });
  if (target.desktop) await drawerSubItem.click();
  else await drawerSubItem.tap();

  const selectTrigger = page.locator('.eli-select__trigger');
  if (target.desktop) await selectTrigger.click();
  else await selectTrigger.tap();
  const secondOption = page.getByRole('option', { name: '옵션 2' });
  if (target.desktop) await secondOption.click();
  else await secondOption.tap();
  assert.match(await selectTrigger.innerText(), /옵션 2/);

  const segment = page.getByRole('radiogroup', { name: '보기 방식' });
  const listOption = segment.getByRole('radio', { name: '목록' });
  const gridOption = segment.getByRole('radio', { name: '격자' });
  if (target.desktop) {
    await listOption.focus();
    await listOption.press('ArrowRight');
  } else {
    await gridOption.tap();
  }
  assert.equal(await gridOption.getAttribute('aria-checked'), 'true');
  if (target.desktop) {
    assert.equal(await gridOption.evaluate(element => element === document.activeElement), true);
  }

  const textField = page.getByLabel('이메일');
  await textField.fill('hello@eli.dev');
  assert.equal(await textField.inputValue(), 'hello@eli.dev');

  const textArea = page.getByLabel('소개');
  await textArea.fill('ELI 컴포넌트 브라우저 검증');
  assert.equal(await textArea.inputValue(), 'ELI 컴포넌트 브라우저 검증');

  const tab = page.getByRole('tab', { name: '소비자 탭' });
  assert.equal(await tab.getAttribute('aria-selected'), 'false');
  if (target.desktop) await tab.click();
  else await tab.tap();
  assert.equal(await tab.getAttribute('aria-selected'), 'true');
  // Tab의 150ms 상태 전환이 끝난 뒤 최종 색상으로 접근성 기준선을 측정해요.
  await expect(tab).toHaveCSS('color', 'rgb(2, 8, 18)');

  // 색상 대비 기준선은 엔진별 계산 차이와 무관하게 한 환경에서만 추적해요.
  if (targetName === 'chromium') {
    const contrast = await new AxeBuilder({ page })
        // 상태 전환 검증을 위해 추가한 테스트 전용 항목은 기존 색상 기준선에서 제외해요.
      .exclude('.browser-drawer-settings')
      .withRules(['color-contrast'])
      .analyze();
    assert.equal(contrast.violations.length, 1);
    assert.equal(contrast.violations[0]?.id, 'color-contrast');
    const contrastTargets = contrast.violations[0]?.nodes.map(node => node.target.join(' ')) ?? [];
    assert.equal(
      contrast.violations[0]?.nodes.length,
      14,
      `디자이너와 합의할 기존 색상 대비 기준선보다 위반이 늘거나 줄면 기준을 다시 검토해야 해요.\n${contrastTargets.join('\n')}`,
    );
  }

  const accessibility = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze();
  const violations = accessibility.violations.map(violation => ({
    id: violation.id,
    nodes: violation.nodes.map(node => node.target.join(' ')),
  }));
  assert.deepEqual(
    violations,
    [],
    '소비자 화면에 자동 검사 가능한 접근성 위반이 없어야 해요.',
  );
  assert.deepEqual(browserErrors, [], '브라우저 콘솔과 페이지 실행 오류가 없어야 해요.');
  await checkModal(page, url);
  await checkTextField(page, url);
  assert.deepEqual(browserErrors, [], 'Modal에서도 브라우저 실행 오류가 없어야 해요.');
  await context.close();
} finally {
  await browser.close();
  server.kill('SIGTERM');
  await new Promise(resolve => {
    if (server.exitCode !== null) resolve();
    else server.once('exit', resolve);
  });
}

console.log(`${targetName}에서 실제 tarball 소비 화면의 상호작용·계산 스타일·axe 접근성 검증을 통과했어요.`);
