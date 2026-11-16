import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const defaultArtifactDirectory = join(root, '.artifacts/package-managers');
const managerNames = [
  'npm',
  'pnpm',
  'yarn-classic',
  'yarn-modern-node-modules',
  'yarn-modern-pnp',
  'bun',
];

function argument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function findTarball() {
  const requested = argument('--tarball');
  if (requested) return resolve(requested);

  const tarballs = (await readdir(defaultArtifactDirectory))
    .filter(file => file.endsWith('.tgz'));
  assert.equal(tarballs.length, 1, '검증할 tarball이 하나여야 해요. 먼저 패키지 검증용 tarball을 만들어요.');
  return join(defaultArtifactDirectory, tarballs[0]);
}

function commandFor(manager) {
  switch (manager) {
    case 'npm':
      return { command: process.env.ELI_NPM_BINARY ?? 'npm', prefix: [], version: '11.19.0' };
    case 'pnpm':
      return { command: 'pnpm', prefix: [], version: '12.8.1' };
    case 'yarn-classic':
      return {
        command: process.env.ELI_YARN_BINARY ?? 'yarn',
        prefix: ['--no-default-rc'],
        version: '1.22.22',
      };
    case 'yarn-modern-node-modules':
    case 'yarn-modern-pnp':
      return {
        command: process.env.ELI_YARN_BINARY ?? 'yarn',
        environment: { YARN_IGNORE_PATH: '1' },
        prefix: [],
        version: '4.18.1',
      };
    case 'bun':
      return { command: process.env.ELI_BUN_BINARY ?? 'bun', prefix: [], version: '1.4.4' };
    default:
      throw new Error(`지원하지 않는 검증 대상이에요: ${manager}`);
  }
}

function execute(tool, args, cwd, options = {}) {
  return execFileSync(tool.command, [...tool.prefix, ...args], {
    cwd,
    encoding: options.encoding,
    env: { ...process.env, ...tool.environment, CI: '1' },
    stdio: options.encoding ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  });
}

function installArguments(manager) {
  if (manager === 'npm') return ['install', '--ignore-scripts', '--no-audit', '--no-fund'];
  if (manager === 'pnpm') return ['install', '--ignore-scripts'];
  if (manager === 'yarn-classic') return ['install', '--ignore-scripts', '--non-interactive'];
  if (manager.startsWith('yarn-modern')) return ['install', '--no-immutable', '--mode=skip-build'];
  return ['install', '--ignore-scripts'];
}

function runArguments(manager, script) {
  if (manager === 'npm' || manager === 'pnpm' || manager === 'bun') return ['run', script];
  return [script];
}

async function collect(directory, extension) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(path, extension));
    else if (entry.name.endsWith(extension)) files.push(path);
  }
  return files;
}

async function verify(manager, tarball) {
  const work = await mkdtemp(join(tmpdir(), `eli-${manager}-`));
  const tool = commandFor(manager);
  const packageManager = manager === 'npm'
    ? 'npm@11.19.0'
    : manager === 'pnpm'
      ? 'pnpm@12.8.1'
      : manager === 'yarn-classic'
        ? 'yarn@1.22.22'
        : manager.startsWith('yarn-modern')
          ? 'yarn@4.18.1'
          : 'bun@1.4.4';

  try {
    await writeFile(join(work, 'package.json'), JSON.stringify({
      name: `eli-${manager}-consumer`,
      private: true,
      type: 'module',
      packageManager,
      scripts: {
        build: 'vite build',
        typecheck: 'tsc --noEmit',
      },
      dependencies: {
        '@eli-design/ui': `file:${tarball}`,
        react: '19.3.0',
        'react-dom': '19.3.0',
      },
      devDependencies: {
        '@types/react': '19.3.0',
        '@types/react-dom': '19.3.0',
        typescript: '5.9.3',
        vite: '8.3.2',
      },
    }, null, 2));
    await writeFile(join(work, 'index.html'), '<html lang="ko"><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>');
    await writeFile(join(work, 'main.tsx'), `import { createRoot } from 'react-dom/client';
import { Button } from '@eli-design/ui/button';
import { Radio } from '@eli-design/ui/radio';
import { Select } from '@eli-design/ui/select';
import { TextField } from '@eli-design/ui/text';

createRoot(document.getElementById('root')!).render(
  <main>
    <Button>소비자 버튼</Button>
    <Radio aria-label="소비자 Radio" name="consumer-radio" value="radio" />
    <Select label="소비자 선택" options={[{ label: '옵션', value: 'option' }]} />
    <TextField label="소비자 입력" />
  </main>,
);
`);
    await writeFile(join(work, 'tsconfig.json'), JSON.stringify({
      compilerOptions: {
        exactOptionalPropertyTypes: true,
        isolatedModules: true,
        jsx: 'react-jsx',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        moduleResolution: 'Bundler',
        noEmit: true,
        skipLibCheck: true,
        strict: true,
        target: 'ES2022',
      },
      include: ['main.tsx'],
    }, null, 2));

    if (manager.startsWith('yarn-modern')) {
      const nodeLinker = manager === 'yarn-modern-pnp' ? 'pnp' : 'node-modules';
      await writeFile(join(work, '.yarnrc.yml'), `nodeLinker: ${nodeLinker}\n${nodeLinker === 'pnp' ? 'pnpMode: strict\npnpFallbackMode: none\n' : ''}`);
    }

    const actualVersion = execute(tool, ['--version'], work, { encoding: 'utf8' }).trim();
    assert.equal(actualVersion, tool.version, `${manager} 검증 도구 버전이 달라요.`);
    execute(tool, installArguments(manager), work);
    execute(tool, runArguments(manager, 'typecheck'), work);
    execute(tool, runArguments(manager, 'build'), work);

    const cssFiles = await collect(join(work, 'dist'), '.css');
    const css = (await Promise.all(cssFiles.map(file => readFile(file, 'utf8')))).join('\n');
    assert.match(css, /\.eli-button/);
    assert.match(css, /\.eli-radio/);
    assert.match(css, /\.eli-select/);
    assert.match(css, /\.eli-text-field/);
    assert.match(css, /--eli-color-blue-500:/);
    console.log(`${manager} ${actualVersion}: ${basename(tarball)} 설치·타입 검사·Vite 빌드를 통과했어요.`);
  } finally {
    if (process.env.ELI_KEEP_PACKAGE_MANAGER_FIXTURE === '1') {
      console.log(`검증 소비 앱을 보존했어요: ${work}`);
    } else {
      await rm(work, { force: true, recursive: true });
    }
  }
}

const tarball = await findTarball();
const requestedManager = argument('--manager');
const selectedManagers = process.argv.includes('--all')
  ? managerNames
  : requestedManager
    ? [requestedManager]
    : [];

assert.ok(selectedManagers.length > 0, '`--manager {이름}` 또는 `--all`을 지정해요.');
for (const manager of selectedManagers) {
  assert.ok(managerNames.includes(manager), `지원하지 않는 검증 대상이에요: ${manager}`);
  await verify(manager, tarball);
}
