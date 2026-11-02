import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { mkdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import net from 'node:net';
import { arch, cpus, platform } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { packInfo, validatePackage } from '../../scripts/check-package.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const work = join(root, '.artifacts/performance');
const consumer = join(work, 'consumer');
const viteBin = join(root, 'node_modules/vite/bin/vite.js');

await rm(work, { force: true, recursive: true });
await mkdir(join(consumer, 'node_modules/@eli/ui'), { recursive: true });

// 소스 경로가 아니라 실제 배포 tarball을 사용해 소비자 조건에 가깝게 측정해요.
const info = packInfo(join(root, 'packages/ui'), work);
await validatePackage(join(root, 'packages/ui'), info);
execFileSync('tar', [
  '-xzf',
  join(work, info.filename),
  '--strip-components=1',
  '-C',
  join(consumer, 'node_modules/@eli/ui'),
]);

// 측정 도구만 고정된 개발 의존성을 공유하고 ELI는 tarball을 직접 풀어 사용해요.
for (const dependency of ['react', 'react-dom', 'vite']) {
  await symlink(
    await realpath(join(root, 'node_modules', dependency)),
    join(consumer, 'node_modules', dependency),
    'junction',
  );
}

await writeFile(join(consumer, 'index.html'), '<html lang="ko"><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>');
await writeFile(join(consumer, 'main.tsx'), `import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Checkbox } from '@eli/ui/checkbox';
import { Select } from '@eli/ui/select';

function SelectScenario({ count }: { count: number }) {
  const options = useMemo(
    () => Array.from({ length: count }, (_, index) => ({
      label: \`옵션 \${index + 1}\`,
      value: \`option-\${index + 1}\`,
    })),
    [count],
  );
  return <Select label={\`성능 선택 \${count}개\`} options={options} />;
}

function CheckboxScenario() {
  const [checked, setChecked] = useState(false);
  return (
    <main>
      <button onClick={() => setChecked(current => !current)} type="button">100개 전환</button>
      {Array.from({ length: 100 }, (_, index) => (
        <Checkbox aria-label={\`성능 체크박스 \${index + 1}\`} checked={checked} key={index} readOnly />
      ))}
    </main>
  );
}

const search = new URLSearchParams(window.location.search);
const scenario = search.get('scenario');
const count = Number(search.get('count') ?? 125);
createRoot(document.getElementById('root')!).render(
  scenario === 'checkbox' ? <CheckboxScenario /> : <SelectScenario count={count} />,
);
`);

execFileSync(process.execPath, [viteBin, 'build', consumer], { cwd: root, stdio: 'inherit' });

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

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}

function summarize(runs) {
  return {
    elapsedMs: median(runs.map(run => run.elapsedMs)),
    longestPauseMs: median(runs.map(run => run.longestPauseMs)),
    runs,
  };
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
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Vite 미리보기 서버가 종료됐어요.\n${serverOutput}`);
    try {
      const response = await fetch(url);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  assert.equal(ready, true, `Vite 미리보기 서버에 연결하지 못했어요.\n${serverOutput}`);

  const context = await browser.newContext();
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  // 같은 기기에서도 비교 조건이 흔들리지 않도록 브라우저 CPU를 4배 제한해요.
  await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const browserErrors = [];
  page.on('console', message => {
    if (message.type() === 'error') browserErrors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', error => browserErrors.push(`pageerror: ${error.message}`));

  async function measure(path, action) {
    await page.goto(`${url}${path}`, { waitUntil: 'networkidle' });
    return await page.evaluate(async actionName => {
      const waits = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const pauses = [];
      // 긴 프레임을 우선 사용하고 지원하지 않는 브라우저에서는 Long Task로 대체해요.
      const entryType = PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')
        ? 'long-animation-frame'
        : PerformanceObserver.supportedEntryTypes.includes('longtask')
          ? 'longtask'
          : undefined;
      const observer = entryType
        ? new PerformanceObserver(list => pauses.push(...list.getEntries().map(entry => entry.duration)))
        : undefined;
      if (observer && entryType) observer.observe({ type: entryType });

      const start = performance.now();
      if (actionName === 'select') {
        const trigger = document.querySelector('.eli-select__trigger');
        if (!(trigger instanceof HTMLButtonElement)) throw new Error('Select 버튼을 찾지 못했어요.');
        trigger.focus();
        trigger.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
        await waits();
        document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'End' }));
        await waits();
        if (!(document.activeElement instanceof HTMLButtonElement)) throw new Error('Select 옵션에 포커스하지 못했어요.');
        document.activeElement.click();
      } else {
        const button = document.querySelector('button');
        if (!(button instanceof HTMLButtonElement)) throw new Error('Checkbox 전환 버튼을 찾지 못했어요.');
        button.click();
      }
      await waits();
      if (observer) pauses.push(...observer.takeRecords().map(entry => entry.duration));
      observer?.disconnect();
      const elapsedMs = performance.now() - start;
      return { elapsedMs, longestPauseMs: Math.max(0, ...pauses) };
    }, action);
  }

  const select125Runs = [];
  const select250Runs = [];
  const checkboxRuns = [];
  for (let run = 0; run < 3; run += 1) {
    select125Runs.push(await measure(`/?scenario=select&count=125&run=${run}`, 'select'));
    select250Runs.push(await measure(`/?scenario=select&count=250&run=${run}`, 'select'));
    const checkbox = await measure(`/?scenario=checkbox&run=${run}`, 'checkbox');
    assert.equal(await page.locator('input[type="checkbox"]:checked').count(), 100);
    checkboxRuns.push(checkbox);
  }

  const select125 = summarize(select125Runs);
  const select250 = summarize(select250Runs);
  const checkbox100 = summarize(checkboxRuns);
  const scaleRatio = select250.elapsedMs / select125.elapsedMs;
  assert.ok(Number.isFinite(scaleRatio) && scaleRatio > 0);
  assert.deepEqual(browserErrors, [], '성능 측정 중 브라우저 오류가 없어야 해요.');

  // 최초 측정값은 비교 기준으로만 기록하고 임의의 수치로 구현을 실패시키지 않아요.
  const report = {
    measuredAt: new Date().toISOString(),
    browser: browser.version(),
    system: {
      architecture: arch(),
      cpu: cpus()[0]?.model ?? 'unknown',
      node: process.version,
      platform: platform(),
    },
    cpuThrottleRate: 4,
    repetitions: 3,
    select: { count125: select125, count250: select250, scaleRatio },
    checkbox100,
    enforcement: '최초 기준선이라 수치로 PR을 실패시키지 않아요.',
  };
  await writeFile(join(work, 'baseline.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  await context.close();
} finally {
  await browser.close();
  server.kill('SIGTERM');
  await new Promise(resolve => {
    if (server.exitCode !== null) resolve();
    else server.once('exit', resolve);
  });
}
