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
  assert.ok(!packed.files.some(file => /^(harness|skills|hooks)\/|\.tsx|tokens\//.test(file.path)));
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
  assert.equal((await run(path, ['--version'])).version, JSON.parse(await readFile(join(root, 'packages/cli/package.json'), 'utf8')).version);
  assert.equal((await run(path, ['add', '--unknown'], 1)).error.code, 'INVALID_ARGUMENT');
});

test('init 미리보기는 파일을 쓰지 않고 목록은 공개 컴포넌트만 보여줘요', async () => {
  const path = await fixture();
  await run(path, ['init', '--registry', base, '--dry-run']);
  assert.ok(!(await readdir(path)).includes('.eli/config.json'));
  const result = await run(path, ['list', '--registry', base]);
  assert.ok(result.items.some(item => item.id === 'button'));
  assert.ok(!result.items.some(item => item.id.startsWith('_') || item.id === 'tokens'));
  await init(path);
  assert.equal((await run(path, ['init', '--registry', base], 1)).error.code, 'FILE_CONFLICT');
});

test('일반 status는 초기 설정과 정상 설치를 한글로 설명하고 JSON 계약을 유지해요', async () => {
  const path = await fixture();
  await init(path);
  const empty = await execFile(process.execPath, [cli, 'status', '--cwd', path]);
  assert.equal(empty.stderr, '');
  assert.ok(empty.stdout.includes('아직 추가한 UI 컴포넌트가 없어요.'));
  assert.ok(empty.stdout.includes('eli-design list'));
  assert.ok(!(await readdir(path)).includes('.eli/lock.json'));
  await run(path, ['add', 'button']);
  const expected = await run(path, ['status']);
  const record = await readFile(join(path, '.eli/lock.json'));
  requests.length = 0;
  const healthy = await execFile(process.execPath, [cli, 'status', '--cwd', path]);
  assert.equal(healthy.stderr, '');
  assert.ok(healthy.stdout.includes(`UI 콘텐츠: ${expected.version}`));
  assert.ok(healthy.stdout.includes(`설치 위치: ${expected.directory}`));
  assert.ok(healthy.stdout.includes(`변경 없음 ${expected.files.length}개`));
  assert.ok(healthy.stdout.includes('직접 수정 0개 · 누락 0개'));
  assert.ok(healthy.stdout.includes('하네스 없음'));
  assert.ok(healthy.stdout.includes('등록된 파일이 모두 설치 당시와 같아요.'));
  assert.deepEqual(await run(path, ['status']), expected);
  assert.deepEqual(await readFile(join(path, '.eli/lock.json')), record);
  assert.deepEqual(requests, []);
});

test('일반 status는 수정·누락 경로와 확인 방법을 보여주고 파일을 복구하거나 기록을 바꾸지 않아요', async () => {
  const path = await fixture();
  await init(path);
  const added = await run(path, ['add', 'button']);
  const modified = added.entries.find(entry => entry.id === 'button').path;
  const missing = added.files.find(file => file.path.endsWith('/Button.css')).path;
  await writeFile(join(path, modified), '// 사용자 커스터마이즈\n');
  await rm(join(path, missing));
  const config = await readFile(join(path, '.eli/config.json'));
  const record = await readFile(join(path, '.eli/lock.json'));
  const expected = await run(path, ['status']);
  requests.length = 0;
  const terminal = await execFile(process.execPath, [cli, 'status', '--cwd', path]);
  assert.equal(terminal.stderr, '');
  assert.ok(terminal.stdout.includes(`직접 수정: ${modified}`));
  assert.ok(terminal.stdout.includes(`누락: ${missing}`));
  assert.ok(terminal.stdout.includes('직접 수정 1개 · 누락 1개'));
  assert.ok(terminal.stdout.includes('커스터마이즈'));
  assert.ok(terminal.stdout.includes('Git 이력이나 백업'));
  assert.ok(terminal.stdout.includes('eli-design status'));
  assert.deepEqual(await run(path, ['status']), expected);
  assert.deepEqual(requests, []);
  assert.equal(await readFile(join(path, modified), 'utf8'), '// 사용자 커스터마이즈\n');
  await assert.rejects(readFile(join(path, missing)), { code: 'ENOENT' });
  assert.deepEqual(await readFile(join(path, '.eli/config.json')), config);
  assert.deepEqual(await readFile(join(path, '.eli/lock.json')), record);
});

test('기본 설치 경로는 src 유무만 따르고 기존 폴더 구조를 자동으로 변경하지 않아요', async () => {
  for (const withSource of [true, false]) {
    const path = await fixture();
    if (!withSource) await rm(join(path, 'src'), { recursive: true });
    await mkdir(join(path, withSource ? 'src/shared/ui' : 'shared/ui'), { recursive: true });
    const directory = withSource ? 'src/components/ui' : 'components/ui';
    const preview = await run(path, ['init', '--registry', base, '--dry-run']);
    assert.equal(preview.config.directory, directory);
    assert.ok(preview.nextSteps.includes(`UI 소스 설치 경로: ${directory}`));
    const initialized = await init(path);
    assert.equal(initialized.config.directory, directory);
  }
});

test('사용자 지정 경로와 기존 별칭으로 설치 소스를 빌드하고 사용자 설정을 보존해요', async () => {
  const path = await fixture();
  await mkdir(join(path, 'src/shared/ui'), { recursive: true });
  await mkdir(join(path, 'src/existing'), { recursive: true });
  const originalFiles = new Map([
    ['src/shared/ui/local.ts', 'export const local = "기존 UI";\n'],
    ['src/existing/message.ts', 'export const message = "기존 별칭";\n'],
    ['tsconfig.json', `// 기존 주석과 경로 별칭을 보존해요.\n${JSON.stringify({ extends: join(root, 'tsconfig.base.json'), compilerOptions: { noEmit: true, paths: { '@/*': ['./src/*'], '@existing/*': ['./src/existing/*'] } }, include: ['src'] }, null, 2)}\n`],
    ['vite.config.mjs', "import { fileURLToPath } from 'node:url';\nexport default { resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)), '@existing': fileURLToPath(new URL('./src/existing', import.meta.url)) } } };\n"],
  ]);
  for (const [file, content] of originalFiles) await writeFile(join(path, file), content);
  const initialized = await run(path, ['init', '--registry', base, '--dir', 'src/shared/ui']);
  assert.equal(initialized.config.directory, 'src/shared/ui');
  const added = await run(path, ['add', 'button']);
  assert.equal(added.entries.find(entry => entry.id === 'button').path, 'src/shared/ui/button.tsx');
  assert.ok(added.files.every(file => file.path.startsWith('src/shared/ui/')));
  for (const [file, content] of originalFiles) assert.equal(await readFile(join(path, file), 'utf8'), content);
  assert.equal((await run(path, ['status'])).directory, 'src/shared/ui');

  // CLI가 별칭을 만들지 않아도 앱이 이미 쓰는 별칭으로 타입과 CSS를 해석해야 해요.
  await writeFile(join(path, 'src/main.ts'), "import { Button } from '@/shared/ui/button';\nimport { message } from '@existing/message';\ndocument.body.textContent = typeof Button + message;\n");
  await writeFile(join(path, 'index.html'), '<html lang="ko"><body><script type="module" src="/src/main.ts"></script></body></html>');
  await execFile(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '-p', join(path, 'tsconfig.json')]);
  const { build } = await import('vite');
  await build({ root: path, logLevel: 'silent' });
  const assets = join(path, 'dist/assets');
  const css = (await Promise.all((await readdir(assets)).filter(file => file.endsWith('.css')).map(file => readFile(join(assets, file), 'utf8')))).join('\n');
  assert.ok(css.includes('.eli-button') && css.includes('--eli-color-blue-500:'));
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
  const before = await readFile(join(path, '.eli/lock.json'), 'utf8');
  assert.equal((await run(path, ['add', 'modal'], 1)).error.code, 'FILE_CONFLICT');
  assert.equal(await readFile(button, 'utf8'), '// 사용자 수정\n');
  assert.equal(await readFile(join(path, '.eli/lock.json'), 'utf8'), before);
});

test('짧은 import와 충돌하는 기존 파일·폴더 구현을 덮어쓰거나 가리지 않아요', async () => {
  for (const file of ['button.tsx', 'button.ts', 'button/index.tsx']) {
    const path = await fixture();
    await mkdir(join(path, 'src/components/ui/button'), { recursive: true });
    const target = join(path, 'src/components/ui', file);
    await writeFile(target, 'export const Button = "기존 구현";\n');
    await init(path);
    const result = await run(path, ['add', 'button'], 1);
    assert.equal(result.error.code, 'FILE_CONFLICT');
    assert.equal(await readFile(target, 'utf8'), 'export const Button = "기존 구현";\n');
    assert.ok(!(await readdir(path)).includes('.eli/lock.json'));
  }
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
  const record = JSON.parse(await readFile(join(path, '.eli/lock.json'), 'utf8'));
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
    assert.deepEqual(added.files.map(file => file.path).sort(), [...expected.files.keys()].map(file => `src/components/ui/${file}`).sort());
    const entry = added.entries.find(item => item.id === component.id);
    assert.ok(entry, component.id);
    for (const [file, content] of expected.files) assert.equal(await readFile(join(path, 'src/components/ui', file), 'utf8'), content, `${component.id}: ${file}`);
  }
});

async function changedRegistry(change, id = 'button') {
  const path = await mkdtemp(join(artifacts, 'registry-'));
  await cp(registry, path, { recursive: true });
  const indexPath = join(path, 'registry.json');
  const index = JSON.parse(await readFile(indexPath, 'utf8'));
  const descriptor = index.items.find(item => item.id === id);
  const itemPath = join(path, descriptor.filename);
  const item = JSON.parse(await readFile(itemPath, 'utf8'));
  change(index, item);
  const bytes = JSON.stringify(item);
  await writeFile(itemPath, bytes);
  descriptor.sha256 = digest(bytes);
  await writeFile(indexPath, JSON.stringify(index));
  return path;
}

test('이전 콘텐츠와 기존 설치 경로·기록은 새 배치로 자동 변경하지 않아요', async () => {
  const content = 'export function Button() { return null; }\n';
  const source = await changedRegistry((_, item) => {
    item.entry.path = 'button/Button/Button.tsx';
    item.dependencies = [];
    item.files = [{ path: item.entry.path, content, sha256: digest(content) }];
  });
  const path = await fixture();
  await run(path, ['init', '--registry', source, '--dir', 'src/components/eli']);
  const config = await readFile(join(path, '.eli/config.json'), 'utf8');
  await run(path, ['add', 'button']);
  const record = await readFile(join(path, '.eli/lock.json'), 'utf8');
  const repeated = await run(path, ['add', 'button']);
  assert.ok(repeated.files.every(file => file.action === 'reuse'));
  const status = await run(path, ['status']);
  assert.equal(status.directory, 'src/components/eli');
  assert.equal(status.entries.find(entry => entry.id === 'button').path, 'src/components/eli/button/Button/Button.tsx');
  assert.equal(await readFile(join(path, '.eli/config.json'), 'utf8'), config);
  assert.equal(await readFile(join(path, '.eli/lock.json'), 'utf8'), record);
  assert.equal(await readFile(join(path, status.entries[0].path), 'utf8'), content);
});

test('기본 조립 항목만 요청해도 부품을 모두 설치하고 재요청은 파일을 바꾸지 않아요', async () => {
  for (const [id, parts] of [
    ['fab', ['fab', 'fab-menu', 'fab-menu-segment']],
    ['navigation-drawer', ['navigation-drawer', 'navigation-drawer-category', 'navigation-drawer-menu', 'navigation-drawer-item']],
  ]) {
    const path = await fixture();
    await init(path);
    requests.length = 0;
    const added = await run(path, ['add', id]);
    assert.deepEqual(added.requested, [id]);
    assert.deepEqual(added.entries.map(item => item.id).sort(), [...parts].sort());
    const expected = await selectFiles(registry, [id]);
    for (const [name, content] of expected.files) assert.equal(await readFile(join(path, 'src/components/ui', name), 'utf8'), content);
    assert.equal(new Set(requests).size, requests.length, '공유 항목은 한 번만 다운로드해요.');
    assert.ok(!requests.some(url => /button|modal|harness/.test(url)));
    const repeated = await run(path, ['add', ...parts]);
    assert.ok(repeated.files.every(file => file.action === 'reuse'));
    for (const [name, content] of expected.files) assert.equal(await readFile(join(path, 'src/components/ui', name), 'utf8'), content);
    const partFirst = await fixture();
    await init(partFirst);
    await run(partFirst, ['add', parts[1]]);
    await run(partFirst, ['add', id]);
    for (const [name, content] of expected.files) assert.equal(await readFile(join(partFirst, 'src/components/ui', name), 'utf8'), content);
  }
});

test('조립 부품의 소스가 변조되면 기준 항목도 파일에 쓰지 않아요', async () => {
  const source = await changedRegistry((_, item) => { item.files[0].content += 'tampered'; }, 'fab-menu-segment');
  const path = await fixture();
  await init(path, source);
  assert.equal((await run(path, ['add', 'fab'], 1)).error.code, 'INTEGRITY_MISMATCH');
  assert.deepEqual(await readdir(join(path, 'src')), []);
  assert.deepEqual(await readdir(join(path, '.eli')), ['config.json']);
});

test('경로 탈출·개발 파일·버전 혼합·자기 참조·내용 변조를 쓰기 전에 거부해요', async () => {
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
    assert.ok(!(await readdir(path)).includes('.eli/lock.json'));
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
  await writeFile(join(path, '.eli/lock.json'), '{}');
  assert.equal((await run(path, ['add', 'button'], 1)).error.code, 'INVALID_RECORD');
  assert.equal(await readFile(join(path, '.eli/lock.json'), 'utf8'), '{}');
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
  const before = await readFile(join(path, '.eli/lock.json'), 'utf8');
  await writeFile(join(path, '.eli/lock.pending.json'), '기존 파일');
  assert.equal((await run(path, ['add', 'modal'], 1)).error.code, 'FILE_CONFLICT');
  assert.equal(await readFile(join(path, '.eli/lock.json'), 'utf8'), before);
  assert.equal(await readFile(join(path, '.eli/lock.pending.json'), 'utf8'), '기존 파일');
  assert.ok(!(await readdir(join(path, 'src/components/ui'))).includes('modal'));
});

test('잘못된 인자·내부 항목 선택·설정 경로 탈출을 허용하지 않아요', async () => {
  const path = await fixture();
  for (const args of [
    ['init', '--registry', ''],
    ['init', '--registry', base, '--dir', '../escape'],
    ['init', '--registry', 'http://example.com/registry.json'],
  ]) await run(path, args, 1);
  await init(path);
  const config = await readFile(join(path, '.eli/config.json'), 'utf8');
  assert.equal((await run(path, ['init', '--registry', base, '--dry-run'], 1)).error.code, 'FILE_CONFLICT');
  assert.equal((await run(path, ['add', 'tokens'], 1)).error.code, 'UNKNOWN_ITEM');
  assert.equal((await run(path, ['add', 'button', '--registry', base], 1)).error.code, 'INVALID_ARGUMENT');
  await writeFile(join(path, '.eli/config.json'), config.replace('src/components/ui', '../escape'));
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
    assert.equal((await loadRegistry(`https://github.com/ELI-team/ELI/releases/download/v${version}/registry.json`)).index.version, version);
    assert.equal(seen.length, 2);
    globalThis.fetch = async () => new Response(null, { status: 302, headers: { location: 'https://example.com/private' } });
    await assert.rejects(loadRegistry('https://github.com/ELI-team/ELI/releases/download/v0.0.0/registry.json'), { code: 'UNSAFE_REGISTRY' });
    await assert.rejects(loadRegistry('https://custom.example/registry.json'), { code: 'UNSAFE_REGISTRY' });
  } finally { globalThis.fetch = original; }
});

test('도구 전용·사전 릴리스를 제외하고 콘텐츠 릴리스를 선택해요', async () => {
  const { latestRegistry, releaseRegistry } = await import('../../packages/cli/dist/registry.mjs');
  const original = globalThis.fetch;
  const releases = [
    { tag_name: 'cli-v0.1.0', assets: [] },
    { tag_name: 'v9.0.0', prerelease: true, assets: [{ name: 'registry.json' }] },
    { tag_name: 'v0.2.0', assets: [{ name: 'registry.json' }] },
  ];
  try {
    globalThis.fetch = async url => {
      assert.equal(url, 'https://api.github.com/repos/ELI-team/ELI/releases?per_page=100');
      return new Response(JSON.stringify(releases));
    };
    assert.equal(releaseRegistry('0.2.0'), 'https://github.com/ELI-team/ELI/releases/download/v0.2.0/registry.json');
    const downloads = [];
    assert.equal(await latestRegistry(downloads), 'https://github.com/ELI-team/ELI/releases/download/v0.2.0/registry.json');
    assert.equal(downloads.length, 1);
    globalThis.fetch = async () => new Response('[]');
    await assert.rejects(latestRegistry([]), { code: 'REGISTRY_UNAVAILABLE' });
  } finally { globalThis.fetch = original; }
});

test('이전·현재 저장소 주소 모두 Release 태그와 콘텐츠 버전을 대조해요', async () => {
  const { loadRegistry } = await import('../../packages/cli/dist/registry.mjs');
  const original = globalThis.fetch;
  const index = await readFile(join(registry, 'registry.json'));
  try {
    globalThis.fetch = async () => new Response(index);
    const version = JSON.parse(index).version;
    for (const owner of ['ELI-team', 'ELI-LDS']) {
      await assert.rejects(loadRegistry(`https://github.com/${owner}/ELI/releases/download/v999.0.0/registry.json`), { code: 'VERSION_MISMATCH' });
      assert.equal((await loadRegistry(`https://github.com/${owner}/ELI/releases/download/v${version}/registry.json`)).index.version, version);
    }
  } finally { globalThis.fetch = original; }
});
