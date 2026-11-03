import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { mkdir, readFile, readdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import net from 'node:net';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { packInfo, validatePackage } from '../../scripts/check-package.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const work = join(root, '.artifacts/next');
const consumer = join(work, 'consumer');
const nextBin = join(root, 'node_modules/next/dist/bin/next');

await rm(work, { recursive: true, force: true });
await mkdir(join(consumer, 'app'), { recursive: true });

// 실제 배포 tarball을 풀어 Next.js가 npm 배포 결과와 같은 파일을 읽게 해요.
const info = packInfo(join(root, 'packages/ui'), work);
await validatePackage(join(root, 'packages/ui'), info);
const installedUi = join(consumer, 'node_modules/@eli/ui');
await mkdir(installedUi, { recursive: true });
execFileSync('tar', [
  '-xzf',
  join(work, info.filename),
  '--strip-components=1',
  '-C',
  installedUi,
]);

// Next.js 검증 도구는 고정된 루트 개발 의존성을 사용하고 ELI만 실제 tarball로 소비해요.
await mkdir(join(consumer, 'node_modules'), { recursive: true });
for (const dependency of ['next', 'react', 'react-dom']) {
  await symlink(
    await realpath(join(root, 'node_modules', dependency)),
    join(consumer, 'node_modules', dependency),
    'junction',
  );
}

await writeFile(
  join(consumer, 'package.json'),
  JSON.stringify({
    name: 'eli-private-next-consumer',
    private: true,
    scripts: { build: 'next build', start: 'next start' },
    dependencies: {
      '@eli/ui': `file:../${info.filename}`,
      next: '16.4.3',
      react: '19.3.0',
      'react-dom': '19.3.0',
    },
  }, null, 2),
);
await writeFile(
  join(consumer, 'tsconfig.json'),
  JSON.stringify({
    compilerOptions: {
      allowJs: true,
      esModuleInterop: true,
      incremental: true,
      isolatedModules: true,
      jsx: 'react-jsx',
      lib: ['dom', 'dom.iterable', 'esnext'],
      module: 'esnext',
      moduleResolution: 'bundler',
      noEmit: true,
      plugins: [{ name: 'next' }],
      resolveJsonModule: true,
      skipLibCheck: true,
      strict: true,
      target: 'ES2017',
    },
    include: ['next-env.d.ts', '.next/types/**/*.ts', '**/*.ts', '**/*.tsx'],
    exclude: ['node_modules'],
  }, null, 2),
);
await writeFile(join(consumer, 'next-env.d.ts'), '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n');
await writeFile(join(consumer, 'next.config.mjs'), 'export default { reactStrictMode: true };\n');
await writeFile(
  join(consumer, 'app/layout.tsx'),
  `export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
`,
);
await writeFile(
  join(consumer, 'app/client-example.tsx'),
  `'use client';

import { useState } from 'react';
import { Button } from '@eli/ui/button';
import { RemovableChip } from '@eli/ui/chip';
import { FabMenu } from '@eli/ui/fab';
import { Select } from '@eli/ui/select';
import { Slider } from '@eli/ui/slider';
import { Tab } from '@eli/ui/tab';

export function ClientExample() {
  const [count, setCount] = useState(0);
  const [selectedTab, setSelectedTab] = useState('first');
  const [sliderValue, setSliderValue] = useState(60);
  const [value, setValue] = useState<string>();

  return (
    <section>
      <h2>클라이언트 상호작용</h2>
      <Button onClick={() => setCount(current => current + 1)}>클릭 {count}</Button>
      <RemovableChip onRemove={() => setCount(current => current + 1)}>삭제 칩</RemovableChip>
      <FabMenu
        items={[{ id: 'create', label: '클라이언트 FAB 액션', onClick: () => setCount(current => current + 1) }]}
        label="클라이언트 FAB"
      />
      <Select
        label="클라이언트 선택"
        onValueChange={setValue}
        options={[{ label: '첫 번째', value: 'first' }]}
        value={value}
      />
      <Slider aria-label="클라이언트 값" onValueChange={setSliderValue} value={sliderValue} />
      <div aria-label="클라이언트 탭" role="tablist">
        <Tab
          active={selectedTab === 'first'}
          label="첫 번째 탭"
          onActiveChange={active => active && setSelectedTab('first')}
        />
        <Tab
          active={selectedTab === 'second'}
          label="두 번째 탭"
          onActiveChange={active => active && setSelectedTab('second')}
        />
      </div>
    </section>
  );
}
`,
);
await writeFile(
  join(consumer, 'app/page.tsx'),
  `import { Alert } from '@eli/ui/alert';
import { Badge } from '@eli/ui/badge';
import { Button, IconButton } from '@eli/ui/button';
import { Checkbox } from '@eli/ui/checkbox';
import { Chip, FilterChip } from '@eli/ui/chip';
import { Divider } from '@eli/ui/divider';
import { Fab } from '@eli/ui/fab';
import { LoadingIndicator, ProgressIndicator } from '@eli/ui/loading';
import { MenuItem } from '@eli/ui/menu';
import { Modal } from '@eli/ui/modal';
import { Radio } from '@eli/ui/radio';
import { Select } from '@eli/ui/select';
import { SegmentControl } from '@eli/ui/segment-control';
import { SnackBar } from '@eli/ui/snackbar';
import { Slider } from '@eli/ui/slider';
import { Tab } from '@eli/ui/tab';
import { TextArea, TextField } from '@eli/ui/text';
import { Toggle } from '@eli/ui/toggle';
import { Tooltip } from '@eli/ui/tooltip';
import { ClientExample } from './client-example';

export default function Page() {
  return (
    <main>
      <h1>ELI Next.js 검증</h1>
      <Alert status="success" title="서버 컴포넌트 알림" />
      <Badge>서버 배지</Badge>
      <Tooltip>서버 도움말</Tooltip>
      <Button>서버에서 렌더링한 버튼</Button>
      <IconButton aria-label="서버 아이콘 버튼" />
      <Checkbox aria-label="서버 체크박스" defaultChecked />
      <Chip selected>서버 선택 칩</Chip>
      <FilterChip
        label="서버 필터"
        options={[{ label: '전체', value: 'all' }]}
        selectedValues={['all']}
      />
      <Divider />
      <Fab label="서버 FAB" />
      <LoadingIndicator aria-label="서버 원형 진행" progress={50} />
      <ProgressIndicator aria-label="서버 막대 진행" />
      <MenuItem>서버 메뉴</MenuItem>
      <Modal message="서버 안내" style={{ display: 'none' }} subMessage={null} />
      <Radio aria-label="서버 Radio" name="server-radio" value="server" />
      <Select
        defaultValue="server"
        label="서버 선택"
        options={[{ label: '서버 옵션', value: 'server' }]}
      />
      <SegmentControl
        aria-label="서버 보기 방식"
        options={[{ label: '목록', value: 'list' }, { label: '격자', value: 'grid' }]}
      />
      <SnackBar>서버 메시지</SnackBar>
      <Slider aria-label="서버 범위" defaultValue={[27, 60]} variant="range" />
      <div aria-label="서버 콘텐츠 탭" role="tablist">
        <Tab label="서버 탭" />
      </div>
      <TextField label="서버 입력" />
      <TextArea label="서버 여러 줄 입력" />
      <Toggle aria-label="서버 토글" />
      <ClientExample />
    </main>
  );
}
`,
);

const nextEnvironment = { ...process.env, NEXT_TELEMETRY_DISABLED: '1' };
execFileSync(process.execPath, [nextBin, 'build'], {
  cwd: consumer,
  env: nextEnvironment,
  stdio: 'inherit',
});

async function collectFiles(directory, extension) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(path, extension));
    else if (entry.name.endsWith(extension)) files.push(path);
  }
  return files;
}

// 패키지 내부 CSS import가 Next.js 프로덕션 CSS에도 포함되는지 확인해요.
const cssFiles = await collectFiles(join(consumer, '.next/static'), '.css');
assert.ok(cssFiles.length > 0, 'Next.js 빌드에 CSS 파일이 생성되어야 해요.');
const css = (await Promise.all(cssFiles.map(file => readFile(file, 'utf8')))).join('\n');
for (const selector of [
  '.eli-alert',
  '.eli-badge',
  '.eli-button',
  '.eli-icon-button',
  '.eli-checkbox',
  '.eli-chip',
  '.eli-divider',
  '.eli-fab',
  '.eli-fab-menu',
  '.eli-fab-menu-segment',
  '.eli-loading-indicator',
  '.eli-progress-indicator',
  '.eli-menu-item',
  '.eli-modal',
  '.eli-radio',
  '.eli-select',
  '.eli-segment-control',
  '.eli-snackbar',
  '.eli-slider',
  '.eli-tab',
  '.eli-text-area',
  '.eli-text-field',
  '.eli-toggle',
  '.eli-tooltip',
]) {
  assert.ok(css.includes(selector), `Next.js CSS에 ${selector} 스타일이 포함되어야 해요.`);
}
assert.match(css, /--eli-font-family-sans:/);

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
const server = spawn(process.execPath, [nextBin, 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
  cwd: consumer,
  env: nextEnvironment,
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverOutput = '';
server.stdout.on('data', chunk => { serverOutput += chunk; });
server.stderr.on('data', chunk => { serverOutput += chunk; });

try {
  let response;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Next.js 서버가 종료됐어요.\n${serverOutput}`);
    try {
      response = await fetch(`http://127.0.0.1:${port}`);
      if (response.ok) break;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  assert.ok(response?.ok, `Next.js 프로덕션 서버에 연결하지 못했어요.\n${serverOutput}`);
  const html = await response.text();
  assert.match(html, /ELI Next\.js 검증/);
  assert.match(html, /서버 컴포넌트 알림/);
  assert.match(html, /서버에서 렌더링한 버튼/);
  assert.match(html, /클라이언트 상호작용/);
  assert.match(html, /서버 탭/);
  assert.match(html, /서버 도움말/);
  assert.match(html, /서버 FAB/);
  assert.match(html, /클라이언트 FAB/);
  assert.match(html, /서버 원형 진행/);
  assert.match(html, /서버 막대 진행/);
  assert.match(html, /서버 Radio/);
  assert.match(html, /첫 번째 탭/);
  assert.match(html, /서버 범위 시작 값/);
  assert.match(html, /\/_next\/static\/.*\.css/);

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const browserErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') browserErrors.push(`console: ${message.text()}`);
    });
    page.on('pageerror', error => browserErrors.push(`pageerror: ${error.message}`));
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'networkidle' });

    const counter = page.getByRole('button', { name: '클릭 0' });
    await counter.click();
    assert.equal(await page.getByRole('button', { name: '클릭 1' }).count(), 1);

    const selectTrigger = page.locator('.eli-select')
      .filter({ hasText: '클라이언트 선택' })
      .locator('.eli-select__trigger');
    await selectTrigger.click();
    await page.getByRole('option', { name: '첫 번째' }).click();
    assert.match(await selectTrigger.innerText(), /첫 번째/);
    assert.deepEqual(browserErrors, [], 'Next.js hydration과 상호작용 중 브라우저 오류가 없어야 해요.');
    await context.close();
  } finally {
    await browser.close();
  }
} finally {
  server.kill('SIGTERM');
  await new Promise(resolve => {
    if (server.exitCode !== null) resolve();
    else server.once('exit', resolve);
  });
}

console.log('실제 ELI tarball의 Next.js App Router 빌드·서버 렌더링·클라이언트 경계·CSS 자동 연결 검증을 통과했어요.');
