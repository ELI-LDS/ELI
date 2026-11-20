import assert from 'node:assert/strict';
import { execFile as execFileCallback, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { cp, mkdir, mkdtemp, readFile, readdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { after, before, test } from 'node:test';
import { selectFiles } from '../registry/fixtures.mjs';

const execFile = promisify(execFileCallback);
const root = fileURLToPath(new URL('../../', import.meta.url));
const artifacts = join(root, '.artifacts/cli-tests');
const registry = join(root, '.artifacts/registry');
const digest = value => createHash('sha256').update(value).digest('hex');
let cli;
let server;
let base;
const requests = [];

before(async () => {
  await rm(artifacts, { recursive: true, force: true });
  await mkdir(artifacts, { recursive: true });
  const output = execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', artifacts], { cwd: join(root, 'packages/cli'), encoding: 'utf8' });
  const packed = JSON.parse(output)[0];
  assert.ok(packed.files.every(file => ['package.json', 'README.md', 'LICENSE'].includes(file.path) || file.path.startsWith('dist/')));
  assert.ok(!packed.files.some(file => /harness|\.tsx|tokens\//.test(file.path)));
  const installed = join(artifacts, 'tool');
  // 실제 tarball을 설치해 저장소의 우연한 상위 의존성 해석에 기대지 않는 실행 파일을 확인해요.
  execFileSync('npm', ['install', '--prefix', installed, '--ignore-scripts', '--no-audit', '--no-fund', '--no-package-lock', join(artifacts, packed.filename)], { stdio: 'pipe' });
  cli = join(installed, 'node_modules/eli-design/dist/cli.mjs');
  const packagedManifest = JSON.parse(await readFile(join(installed, 'node_modules/eli-design/package.json'), 'utf8'));
  assert.deepEqual(Object.keys(packagedManifest.dependencies), ['semver']);
  await writeFile(join(artifacts, 'package-size.json'), JSON.stringify({ size: packed.size, unpackedSize: packed.unpackedSize, files: packed.files.length }, null, 2));
  server = createServer(async (request, response) => {
    requests.push(request.url);
    try {
      assert.match(request.url, /^\/[_a-z0-9-]+\.json$/);
      response.end(await readFile(join(registry, request.url.slice(1))));
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/registry.json`;
});

after(async () => { server?.closeAllConnections(); await new Promise(resolve => server ? server.close(resolve) : resolve()); });

async function fixture() {
  const path = await mkdtemp(join(artifacts, 'project-'));
  await mkdir(join(path, 'src'));
  await mkdir(join(path, 'node_modules'));
  await symlink(await realpath(join(root, 'node_modules/react')), join(path, 'node_modules/react'), 'junction');
  await writeFile(join(path, 'package.json'), JSON.stringify({ private: true, type: 'module', dependencies: { react: '19.3.0' }, packageManager: 'pnpm@12.8.1' }));
  return path;
}

async function run(path, args, code = 0) {
  let result;
  try { result = await execFile(process.execPath, [cli, ...args, '--cwd', path, '--json']); }
  catch (error) { result = error; }
  assert.equal(typeof result.code === 'number' ? result.code : 0, code, `${result.stdout}\n${result.stderr}`);
  assert.equal(result.stderr, '');
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.ok, code === 0);
  return parsed;
}

const init = (path, source = base) => run(path, ['init', '--registry', source]);

test('tarball의 실행 파일이 도움말·버전을 제공하고 잘못된 인자는 실패해요', async () => {
  const path = await fixture();
  assert.match((await run(path, ['--help'])).message, /add --all/);
  assert.equal((await run(path, ['--version'])).version, '0.1.0');
  assert.equal((await run(path, ['add', '--unknown'], 1)).error.code, 'INVALID_ARGUMENT');
});

test('init 미리보기는 파일을 쓰지 않고 목록은 공개 컴포넌트만 보여줘요', async () => {
  const path = await fixture();
  await run(path, ['init', '--registry', base, '--dry-run']);
  assert.ok(!(await readdir(path)).includes('eli.json'));
  const result = await run(path, ['list', '--registry', base]);
  assert.ok(result.items.some(item => item.id === 'button'));
  assert.ok(!result.items.some(item => item.id.startsWith('_') || item.id === 'tokens'));
  await init(path);
  assert.equal((await run(path, ['init', '--registry', base], 1)).error.code, 'FILE_CONFLICT');
});

test('Button만 다운로드하고 미리보기·재실행·사용자 수정 상태를 구분해요', async () => {
  const path = await fixture();
  await init(path);
  requests.length = 0;
  const dry = await run(path, ['add', 'button', '--dry-run']);
  assert.ok(!dry.resolved.includes('icon-button') && !dry.resolved.includes('modal'));
  assert.ok(dry.resolved.includes('tokens'));
  assert.ok(!(await readdir(join(path, 'src'))).includes('components'));
  assert.ok(!requests.includes('/icon-button.json') && !requests.includes('/modal.json'));
  const installed = await run(path, ['add', 'button']);
  assert.ok(installed.files.every(file => file.action === 'add'));
  assert.deepEqual(installed.requirements, [{ name: 'react', version: '19.3.0', ranges: ['^19.3.0'] }]);
  const repeated = await run(path, ['add', 'button']);
  assert.ok(repeated.files.every(file => file.action === 'reuse'));
  const button = join(path, installed.entries.find(entry => entry.id === 'button').path);
  await writeFile(button, '// 사용자 수정\n');
  requests.length = 0;
  const status = await run(path, ['status']);
  assert.deepEqual(requests, []);
  assert.equal(status.files.filter(file => file.state === 'modified').length, 1);
  const before = await readFile(join(path, 'eli.lock.json'), 'utf8');
  assert.equal((await run(path, ['add', 'modal'], 1)).error.code, 'FILE_CONFLICT');
  assert.equal(await readFile(button, 'utf8'), '// 사용자 수정\n');
  assert.equal(await readFile(join(path, 'eli.lock.json'), 'utf8'), before);
});

test('조합 컴포넌트·여러 개·전체 추가도 같은 원본과 공유 파일을 사용해요', async () => {
  const path = await fixture();
  await init(path);
  const combined = await run(path, ['add', 'modal', 'select', 'fab-menu']);
  for (const id of ['button', 'menu-item', 'fab', 'fab-menu-segment']) assert.ok(combined.resolved.includes(id));
  assert.equal(combined.files.filter(file => file.path.endsWith('/tokens/colors.css')).length, 1);
  const all = await run(path, ['add', '--all']);
  const index = JSON.parse(await readFile(join(registry, 'registry.json'), 'utf8'));
  assert.equal(all.entries.length, index.items.filter(item => item.kind === 'component').length);
  assert.ok(all.files.every(file => !file.path.includes('/harness/')));
  const record = JSON.parse(await readFile(join(path, 'eli.lock.json'), 'utf8'));
  for (const file of record.files) assert.equal(digest(await readFile(join(path, file.path))), file.sha256);
  assert.equal((await run(path, ['add', '--all', 'button'], 1)).error.code, 'INVALID_ARGUMENT');
});

test('모든 공개 컴포넌트를 각각 새 프로젝트에 단독 선택해 추가할 수 있어요', async () => {
  const index = JSON.parse(await readFile(join(registry, 'registry.json'), 'utf8'));
  for (const component of index.items.filter(item => item.kind === 'component')) {
    const path = await fixture();
    await init(path);
    const added = await run(path, ['add', component.id]);
    assert.deepEqual(added.requested, [component.id]);
    const expected = await selectFiles(registry, [component.id]);
    assert.deepEqual(added.resolved, [...expected.selected.keys()].sort());
    assert.deepEqual(added.files.map(file => file.path).sort(), [...expected.files.keys()].map(file => `src/components/eli/${file}`).sort());
    const entry = added.entries.find(item => item.id === component.id);
    assert.ok(entry, component.id);
    for (const [file, content] of expected.files) assert.equal(await readFile(join(path, 'src/components/eli', file), 'utf8'), content, `${component.id}: ${file}`);
  }
});

async function changedRegistry(change) {
  const path = await mkdtemp(join(artifacts, 'registry-'));
  await cp(registry, path, { recursive: true });
  const indexPath = join(path, 'registry.json');
  const index = JSON.parse(await readFile(indexPath, 'utf8'));
  const descriptor = index.items.find(item => item.id === 'button');
  const itemPath = join(path, descriptor.filename);
  const item = JSON.parse(await readFile(itemPath, 'utf8'));
  change(index, item);
  const bytes = JSON.stringify(item);
  await writeFile(itemPath, bytes);
  descriptor.sha256 = digest(bytes);
  await writeFile(indexPath, JSON.stringify(index));
  return path;
}

test('경로 탈출·개발 파일·버전 혼합·순환 의존·내용 변조를 쓰기 전에 거부해요', async () => {
  for (const [mutate, expected] of [
    [(_, item) => { item.files[0].path = '../outside.ts'; }, 'UNSAFE_PATH'],
    [(_, item) => { item.files[0].path = 'button/Button.test.tsx'; }, 'UNSAFE_PATH'],
    [(_, item) => { item.version = '999.0.0'; }, 'VERSION_MISMATCH'],
    [(_, item) => { item.dependencies.push('button'); }, 'INVALID_DATA'],
    [(_, item) => { item.files[0].content += 'changed'; }, 'INTEGRITY_MISMATCH'],
  ]) {
    const source = await changedRegistry(mutate);
    const path = await fixture();
    await init(path, source);
    assert.equal((await run(path, ['add', 'button'], 1)).error.code, expected);
    assert.deepEqual(await readdir(join(path, 'src')), []);
    assert.ok(!(await readdir(path)).includes('eli.lock.json'));
  }
});

test('고정한 목록이 바뀌거나 항목 JSON의 해시가 달라지면 중단해요', async () => {
  const source = await changedRegistry(() => {});
  const path = await fixture();
  await init(path, source);
  await writeFile(join(source, 'button.json'), '{}');
  assert.equal((await run(path, ['add', 'button'], 1)).error.code, 'INTEGRITY_MISMATCH');
  await writeFile(join(source, 'registry.json'), await readFile(join(registry, 'registry.json')));
  assert.equal((await run(path, ['add', 'button'], 1)).error.code, 'INTEGRITY_MISMATCH');
});

test('심볼릭 링크·기존 파일·중복 설치 프로세스는 기존 내용을 보존해요', async () => {
  const path = await fixture();
  await init(path);
  const outside = await mkdtemp(join(artifacts, 'outside-'));
  await symlink(outside, join(path, 'src/components'), 'junction');
  assert.equal((await run(path, ['add', 'button'], 1)).error.code, 'UNSAFE_PATH');
  assert.deepEqual(await readdir(outside), []);
  await rm(join(path, 'src/components'));
  await mkdir(join(path, '.eli-install.lock'));
  assert.equal((await run(path, ['add', 'button'], 1)).error.code, 'PROJECT_BUSY');
  await rm(join(path, '.eli-install.lock'), { recursive: true });
  await writeFile(join(path, 'eli.lock.json'), '{}');
  assert.equal((await run(path, ['add', 'button'], 1)).error.code, 'INVALID_RECORD');
  assert.equal(await readFile(join(path, 'eli.lock.json'), 'utf8'), '{}');
});

test('패키지 매니저 혼합·React 누락·지원하지 않는 버전은 파일 추가 전에 알려줘요', async () => {
  const path = await fixture();
  await writeFile(join(path, 'yarn.lock'), '');
  assert.equal((await run(path, ['init', '--registry', base], 1)).error.code, 'PACKAGE_MANAGER_CONFLICT');
  await rm(join(path, 'yarn.lock'));
  await init(path);
  await writeFile(join(path, 'package.json'), '{"private":true}');
  assert.equal((await run(path, ['add', 'button'], 1)).error.code, 'MISSING_DEPENDENCY');
  await writeFile(join(path, 'package.json'), '{"dependencies":{"react":"18.3.1"}}');
  assert.equal((await run(path, ['add', 'button'], 1)).error.code, 'INCOMPATIBLE_DEPENDENCY');
  await rm(join(path, 'node_modules/react'));
  await mkdir(join(path, 'node_modules/react'));
  await writeFile(join(path, 'node_modules/react/package.json'), '{"name":"react","version":"18.3.1"}');
  assert.equal((await run(path, ['add', 'button'], 1)).error.code, 'INCOMPATIBLE_DEPENDENCY');
  assert.deepEqual(await readdir(join(path, 'src')), []);
});

test('설치 기록 교체에 실패하면 새 소스를 되돌리고 기존 기록을 보존해요', async () => {
  const path = await fixture();
  await init(path);
  await run(path, ['add', 'button']);
  const before = await readFile(join(path, 'eli.lock.json'), 'utf8');
  await writeFile(join(path, 'eli.lock.pending.json'), '기존 파일');
  assert.equal((await run(path, ['add', 'modal'], 1)).error.code, 'FILE_CONFLICT');
  assert.equal(await readFile(join(path, 'eli.lock.json'), 'utf8'), before);
  assert.equal(await readFile(join(path, 'eli.lock.pending.json'), 'utf8'), '기존 파일');
  assert.ok(!(await readdir(join(path, 'src/components/eli'))).includes('modal'));
});

test('잘못된 인자·내부 항목 선택·설정 경로 탈출을 허용하지 않아요', async () => {
  const path = await fixture();
  for (const args of [
    ['init', '--registry', ''],
    ['init', '--registry', base, '--dir', '../escape'],
    ['init', '--registry', 'http://example.com/registry.json'],
  ]) await run(path, args, 1);
  await init(path);
  const config = await readFile(join(path, 'eli.json'), 'utf8');
  assert.equal((await run(path, ['init', '--registry', base, '--dry-run'], 1)).error.code, 'FILE_CONFLICT');
  assert.equal((await run(path, ['add', 'tokens'], 1)).error.code, 'UNKNOWN_ITEM');
  assert.equal((await run(path, ['add', 'button', '--registry', base], 1)).error.code, 'INVALID_ARGUMENT');
  await writeFile(join(path, 'eli.json'), config.replace('src/components/eli', '../escape'));
  assert.equal((await run(path, ['status'], 1)).error.code, 'UNSAFE_PATH');
  assert.deepEqual(await readdir(join(path, 'src')), []);
});

test('GitHub asset CDN만 따라가고 다른 리디렉션은 거부해요', async () => {
  const { loadRegistry } = await import('../../packages/cli/dist/registry.mjs');
  const original = globalThis.fetch;
  const index = await readFile(join(registry, 'registry.json'));
  const seen = [];
  try {
    globalThis.fetch = async url => {
      seen.push(url);
      return seen.length === 1
        ? new Response(null, { status: 302, headers: { location: 'https://release-assets.githubusercontent.com/example' } })
        : new Response(index);
    };
    const version = JSON.parse(index).version;
    assert.equal((await loadRegistry(`https://github.com/ELI-LDS/ELI/releases/download/v${version}/registry.json`)).index.version, version);
    assert.equal(seen.length, 2);
    globalThis.fetch = async () => new Response(null, { status: 302, headers: { location: 'https://example.com/private' } });
    await assert.rejects(loadRegistry('https://github.com/ELI-LDS/ELI/releases/download/v0.0.0/registry.json'), { code: 'UNSAFE_REGISTRY' });
    await assert.rejects(loadRegistry('https://custom.example/registry.json'), { code: 'UNSAFE_REGISTRY' });
  } finally { globalThis.fetch = original; }
});

test('도구 전용·사전 릴리스를 제외하고 콘텐츠 릴리스를 선택해요', async () => {
  const { latestRegistry } = await import('../../packages/cli/dist/registry.mjs');
  const original = globalThis.fetch;
  const releases = [
    { tag_name: 'cli-v0.1.0', assets: [] },
    { tag_name: 'v9.0.0', prerelease: true, assets: [{ name: 'registry.json' }] },
    { tag_name: 'v0.2.0', assets: [{ name: 'registry.json' }] },
  ];
  try {
    globalThis.fetch = async () => new Response(JSON.stringify(releases));
    const downloads = [];
    assert.equal(await latestRegistry(downloads), 'https://github.com/ELI-LDS/ELI/releases/download/v0.2.0/registry.json');
    assert.equal(downloads.length, 1);
    globalThis.fetch = async () => new Response('[]');
    await assert.rejects(latestRegistry([]), { code: 'REGISTRY_UNAVAILABLE' });
  } finally { globalThis.fetch = original; }
});
