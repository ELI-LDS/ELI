import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import net from 'node:net';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';

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

const browser = await chromium.launch();

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

  const context = await browser.newContext();
  const page = await context.newPage();
  const browserErrors = [];
  page.on('console', message => {
    if (message.type() === 'error') browserErrors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', error => browserErrors.push(`pageerror: ${error.message}`));
  await page.goto(url, { waitUntil: 'networkidle' });

  const customButton = page.getByRole('button', { name: '커스텀 버튼', exact: true });
  assert.equal(await customButton.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(124, 58, 237)');
  await customButton.hover();
  assert.equal(await customButton.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(109, 40, 217)');
  await page.mouse.down();
  assert.equal(await customButton.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(91, 33, 182)');
  await page.mouse.up();

  const disabledButton = page.getByRole('button', { name: '비활성 커스텀 버튼' });
  assert.equal(await disabledButton.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(196, 181, 253)');

  const checkbox = page.getByRole('checkbox', { name: '약관 동의' });
  assert.equal(await checkbox.isChecked(), true);
  await checkbox.press('Space');
  assert.equal(await checkbox.isChecked(), false);

  const toggle = page.getByRole('switch', { name: '알림 설정' });
  assert.equal(await toggle.getAttribute('aria-checked'), 'true');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-checked'), 'false');

  const selectTrigger = page.locator('.eli-select__trigger');
  await selectTrigger.click();
  await page.getByRole('option', { name: '옵션 2' }).click();
  assert.match(await selectTrigger.innerText(), /옵션 2/);

  const segment = page.getByRole('radiogroup', { name: '보기 방식' });
  const listOption = segment.getByRole('radio', { name: '목록' });
  const gridOption = segment.getByRole('radio', { name: '격자' });
  await listOption.focus();
  await listOption.press('ArrowRight');
  assert.equal(await gridOption.getAttribute('aria-checked'), 'true');
  assert.equal(await gridOption.evaluate(element => element === document.activeElement), true);

  const textField = page.getByLabel('이메일');
  await textField.fill('hello@eli.dev');
  assert.equal(await textField.inputValue(), 'hello@eli.dev');

  const textArea = page.getByLabel('소개');
  await textArea.fill('ELI 컴포넌트 브라우저 검증');
  assert.equal(await textArea.inputValue(), 'ELI 컴포넌트 브라우저 검증');

  const tab = page.getByRole('tab', { name: '소비자 탭' });
  assert.equal(await tab.getAttribute('aria-selected'), 'false');
  await tab.click();
  assert.equal(await tab.getAttribute('aria-selected'), 'true');

  const contrast = await new AxeBuilder({ page })
    .exclude('.browser-modal')
    .withRules(['color-contrast'])
    .analyze();
  assert.equal(contrast.violations.length, 1);
  assert.equal(contrast.violations[0]?.id, 'color-contrast');
  assert.equal(
    contrast.violations[0]?.nodes.length,
    14,
    '디자이너와 합의할 기존 색상 대비 기준선보다 위반이 늘거나 줄면 기준을 다시 검토해야 해요.',
  );

  const accessibility = await new AxeBuilder({ page })
    .exclude('.browser-modal')
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
  await context.close();
} finally {
  await browser.close();
  server.kill('SIGTERM');
  await new Promise(resolve => {
    if (server.exitCode !== null) resolve();
    else server.once('exit', resolve);
  });
}

console.log('실제 tarball 소비 화면의 상호작용·키보드·계산 스타일·axe 접근성 검증을 통과했어요.');
