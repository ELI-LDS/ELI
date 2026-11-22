import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = join(root, '.artifacts/cli-package-managers');
const digest = value => createHash('sha256').update(value).digest('hex');
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const tools = {
  npm: { command: process.env.ELI_NPM_BINARY ?? 'npm', family: 'npm', version: '11.19.0' },
  pnpm: { command: process.env.ELI_PNPM_BINARY ?? 'pnpm', family: 'pnpm', version: '12.8.1' },
  'yarn-classic': { command: process.env.ELI_YARN_CLASSIC_BINARY ?? process.env.ELI_YARN_BINARY ?? 'yarn', family: 'yarn', version: '1.22.22', prefix: ['--no-default-rc'] },
  'yarn-modern-node-modules': { command: process.env.ELI_YARN_MODERN_BINARY ?? process.env.ELI_YARN_BINARY ?? 'yarn', family: 'yarn', version: '4.18.1' },
  'yarn-modern-pnp': { command: process.env.ELI_YARN_MODERN_BINARY ?? process.env.ELI_YARN_BINARY ?? 'yarn', family: 'yarn', version: '4.18.1' },
  bun: { command: process.env.ELI_BUN_BINARY ?? 'bun', family: 'bun', version: '1.4.4' },
};

function argument(name) {
  const index = process.argv.indexOf(name);
  return index < 0 ? undefined : process.argv[index + 1];
}

function execute(tool, args, cwd, env, capture = false) {
  return execFileSync(tool.command, [...(tool.prefix ?? []), ...args], {
    cwd, env, encoding: capture ? 'utf8' : undefined,
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit', timeout: 180_000,
  });
}

/** 검사 중 다시 빌드한 파일이 섞이지 않도록 같은 tarball과 레지스트리를 모든 행에 전달해요. */
async function prepare() {
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  const packed = JSON.parse(execute(tools.npm, ['pack', '--ignore-scripts', '--json', '--pack-destination', output], join(root, 'packages/cli'), process.env, true))[0];
  assert.ok(packed.files.every(file => ['package.json', 'README.md', 'LICENSE'].includes(file.path) || file.path.startsWith('dist/')));
  assert.ok(!packed.files.some(file => /^(harness|skills|hooks)\/|\.tsx|tokens\//.test(file.path)));
  const sha256 = digest(await readFile(join(output, packed.filename)));
  const filename = packed.filename.replace(/\.tgz$/, `-${sha256.slice(0, 12)}.tgz`);
  await rename(join(output, packed.filename), join(output, filename));
  await cp(join(root, '.artifacts/registry'), join(output, 'registry'), { recursive: true });
  await cp(join(root, '.artifacts/harness'), join(output, 'harness'), { recursive: true });
  await writeFile(join(output, 'candidate.json'), serialize({ filename, sha256, toolVersion: packed.version, size: packed.size, unpackedSize: packed.unpackedSize, files: packed.files.length }));
  console.log(`CLI 행렬의 공통 후보: ${filename} (${sha256})`);
}

const preserved = ['package.json', 'package-lock.json', 'npm-shrinkwrap.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lock', 'bun.lockb', '.yarnrc.yml', '.pnp.cjs', '.pnp.loader.mjs', '.yarn/install-state.gz'];
async function snapshot(directory) {
  const result = {};
  for (const file of preserved) {
    try { result[file] = digest(await readFile(join(directory, file))); }
    catch (error) { if (error.code === 'ENOENT') result[file] = null; else throw error; }
  }
  return result;
}

function installArgs(manager) {
  if (manager === 'npm') return ['install', '--ignore-scripts', '--no-audit', '--no-fund'];
  if (manager === 'yarn-classic') return ['install', '--ignore-scripts', '--non-interactive'];
  if (manager.startsWith('yarn-modern')) return ['install', '--no-immutable', '--mode=skip-build'];
  return ['install', '--ignore-scripts'];
}

function ephemeral(manager, tarball, args) {
  if (manager === 'npm' || manager === 'yarn-classic') return { tool: tools.npm, args: ['exec', '--yes', '--package', tarball, '--', 'eli-design', ...args] };
  if (manager === 'pnpm') return { tool: tools.pnpm, args: ['--silent', '--package', tarball, 'dlx', 'eli-design', ...args] };
  if (manager.startsWith('yarn-modern')) return { tool: tools[manager], args: ['dlx', '--quiet', '--package', `eli-design@file:${tarball}`, 'eli-design', ...args] };
  return { tool: tools.bun, args: ['x', '--silent', '--package', tarball, 'eli-design', ...args] };
}

async function collectCss(directory) {
  let css = '';
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) css += await collectCss(path);
    else if (entry.name.endsWith('.css')) css += await readFile(path, 'utf8');
  }
  return css;
}

async function verify(manager, candidate) {
  const tool = tools[manager];
  const work = await mkdtemp(join(tmpdir(), `eli-cli-${manager}-`));
  const tarball = join(output, candidate.filename);
  const registry = join(output, 'registry');
  const env = {
    ...process.env, CI: '1', YARN_IGNORE_PATH: '1',
    PATH: [...(tool.command.includes('/') ? [dirname(tool.command)] : []), dirname(process.execPath), process.env.PATH].join(delimiter),
    npm_config_cache: join(work, '.cache/npm'),
    BUN_INSTALL_CACHE_DIR: join(work, '.cache/bun'),
    COREPACK_ENABLE_AUTO_PIN: '0',
  };
  try {
    assert.equal(digest(await readFile(tarball)), candidate.sha256, '공통 CLI tarball이 변경됐어요.');
    await writeFile(join(work, 'package.json'), serialize({
      name: `eli-cli-${manager}-consumer`, private: true, type: 'module', packageManager: `${tool.family}@${tool.version}`,
      scripts: {
        typecheck: 'tsc --noEmit', build: 'vite build',
        ssr: 'vite build --ssr ssr.tsx --outDir dist-ssr && node dist-ssr/ssr.js',
      },
      dependencies: { react: '19.3.0', 'react-dom': '19.3.0' },
      devDependencies: { '@types/react': '19.3.0', '@types/react-dom': '19.3.0', typescript: '5.9.3', vite: '8.3.2' },
    }));
    await mkdir(join(work, 'src'));
    await writeFile(join(work, 'index.html'), '<html lang="ko"><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>');
    await writeFile(join(work, 'main.tsx'), `import { createRoot } from 'react-dom/client';
import { Button } from './src/components/ui/button';
import { Select } from './src/components/ui/select';
import { Modal } from './src/components/ui/modal';
createRoot(document.getElementById('root')!).render(<main><Button>CLI 버튼</Button><Select label="CLI 선택" options={[{ label: '옵션', value: 'first' }]} /><Modal title="CLI 모달" style={{ display: 'none' }} /></main>);
`);
    await writeFile(join(work, 'ssr.tsx'), `import { renderToString } from 'react-dom/server';
import { Button } from './src/components/ui/button';
import { Select } from './src/components/ui/select';
const html = renderToString(<main><Button>CLI 서버 버튼</Button><Select label="CLI 서버 선택" options={[]} /></main>);
if (!html.includes('CLI 서버 버튼') || !html.includes('CLI 서버 선택')) throw new Error('SSR HTML이 없어요.');
console.log('CLI 소스의 SSR을 통과했어요.');
`);
    await writeFile(join(work, 'tsconfig.json'), serialize({
      compilerOptions: { target: 'ES2022', lib: ['ES2022', 'DOM', 'DOM.Iterable'], module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, skipLibCheck: true, noEmit: true, isolatedModules: true, exactOptionalPropertyTypes: true },
      include: ['main.tsx', 'ssr.tsx', 'src/**/*.tsx', 'src/**/*.ts'],
    }));
    if (manager.startsWith('yarn-modern')) {
      await writeFile(join(work, '.yarnrc.yml'), `nodeLinker: ${manager.endsWith('pnp') ? 'pnp' : 'node-modules'}\n${manager.endsWith('pnp') ? 'pnpMode: strict\npnpFallbackMode: none\n' : ''}`);
    }
    const actualVersion = execute(tool, ['--version'], work, env, true).trim();
    assert.equal(actualVersion, tool.version, `${manager}의 검증 도구 버전이 달라요.`);
    if (manager === 'yarn-classic' || manager.endsWith('pnp')) {
      assert.equal(execute(tools.npm, ['--version'], work, env, true).trim(), tools.npm.version, '추가 CLI 실행 경로의 npm 버전이 달라요.');
    }
    execute(tool, installArgs(manager), work, env);
    const baseline = await snapshot(work);
    const invoke = (args, mode = manager) => {
      const command = ephemeral(mode, tarball, [...args, '--cwd', work, '--json']);
      const result = JSON.parse(execute(command.tool, command.args, work, env, true));
      assert.equal(result.ok, true, JSON.stringify(result));
      return result;
    };
    assert.equal(invoke(['--version']).version, candidate.toolVersion);
    invoke(['init', '--registry', registry]);
    const dry = invoke(['add', 'button', '--dry-run']);
    assert.ok(!dry.resolved.includes('icon-button') && !dry.resolved.includes('modal'));
    assert.deepEqual(await readdir(join(work, 'src')), []);
    const button = invoke(['add', 'button']);
    assert.equal(button.manager, tool.family);
    assert.ok(button.files.every(file => file.action === 'add'));
    const combined = invoke(['add', 'modal', 'select']);
    assert.ok(combined.resolved.includes('button') && combined.resolved.includes('menu-item'));
    assert.ok(combined.files.some(file => file.action === 'reuse' && file.path.endsWith('/tokens/colors.css')));
    const repeated = invoke(['add', 'button']);
    assert.ok(repeated.files.every(file => file.action === 'reuse'));
    const status = invoke(['status']);
    assert.ok(status.files.every(file => file.state === 'unchanged'));
    const harness = invoke(['harness', '--registry', join(output, 'harness'), '--agent', 'all']);
    assert.deepEqual(harness.agents, ['claude', 'codex']);
    assert.ok(invoke(['harness', '--registry', join(output, 'harness'), '--agent', 'all']).files.every(file => file.action === 'reuse'));
    assert.ok(invoke(['status']).harness.files.every(file => file.state === 'unchanged'));
    if (manager.endsWith('pnp')) {
      assert.equal(invoke(['add', 'button', '--dry-run'], 'npm').requirements[0].version, '19.3.0');
    }
    assert.deepEqual(await snapshot(work), baseline, 'CLI가 프로젝트 의존성·lockfile·PnP 설정을 바꿨어요.');
    for (const script of ['typecheck', 'build', 'ssr']) execute(tool, ['run', script], work, env);
    const css = await collectCss(join(work, 'dist'));
    for (const token of ['.eli-button', '.eli-select', '.eli-menu-item', '.eli-modal', '.eli-dim', '--eli-color-blue-500:']) assert.ok(css.includes(token), token);
    const record = JSON.parse(await readFile(join(work, 'eli.lock.json'), 'utf8'));
    for (const file of record.files) assert.equal(digest(await readFile(join(work, file.path))), file.sha256);
    assert.deepEqual(await snapshot(work), baseline, '소비 검사 후 프로젝트 설정이 달라졌어요.');
    const report = { manager, version: actualVersion, node: process.versions.node, platform: process.platform, arch: process.arch, tarball: candidate.filename, sha256: candidate.sha256, passed: true, checks: ['ephemeral-bin', 'init', 'dry-run', 'button', 'composite-dependencies', 'shared-reuse', 'status', 'harness-agents', 'harness-reuse', 'harness-status', 'metadata-preserved', 'typecheck', 'vite-css', 'ssr'] };
    await mkdir(join(output, 'reports'), { recursive: true });
    await writeFile(join(output, 'reports', `${manager}.json`), serialize(report));
    console.log(`${manager} ${actualVersion}: 동일 CLI tarball의 실행·소스 설치·lockfile 보존·타입·Vite·CSS·SSR을 통과했어요.`);
  } catch (error) {
    if (error.stdout) console.error(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
    throw error;
  } finally {
    if (process.env.ELI_KEEP_PACKAGE_MANAGER_FIXTURE === '1') console.log(`검증 소비 앱을 보존했어요: ${work}`);
    else await rm(work, { recursive: true, force: true });
  }
}

if (process.argv.includes('--prepare')) await prepare();
else {
  const candidate = JSON.parse(await readFile(join(output, 'candidate.json'), 'utf8'));
  const managers = process.argv.includes('--all') ? Object.keys(tools) : [argument('--manager')];
  assert.ok(managers.length && managers.every(manager => Object.hasOwn(tools, manager)), '--manager 또는 --all을 지정해요.');
  for (const manager of managers) await verify(manager, candidate);
}
