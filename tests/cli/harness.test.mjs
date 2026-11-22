import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFile, chmod, mkdir, mkdtemp, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { after, before, test } from 'node:test';

const root = fileURLToPath(new URL('../../', import.meta.url));
const bundle = join(root, '.artifacts/harness');
const toolVersion = JSON.parse(await readFile(join(root, 'packages/cli/package.json'), 'utf8')).version;
const harnessVersion = JSON.parse(await readFile(join(root, 'packages/harness/package.json'), 'utf8')).version;
const digest = value => createHash('sha256').update(value).digest('hex');
let work;
let cli;

before(async () => {
  work = await mkdtemp(join(tmpdir(), 'eli-harness-cli-'));
  const [packed] = JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', work], { cwd: join(root, 'packages/cli'), encoding: 'utf8' }));
  assert.ok(!packed.files.some(file => /^(harness|skills|hooks)\//.test(file.path)));
  execFileSync('npm', ['install', '--prefix', join(work, 'tool'), '--ignore-scripts', '--no-audit', '--no-fund', join(work, packed.filename)], { stdio: 'pipe' });
  cli = join(work, 'tool/node_modules/eli-design/dist/cli.mjs');
});
after(async () => { if (work) await rm(work, { recursive: true, force: true }); });

async function fixture() {
  const project = await mkdtemp(join(work, 'app-'));
  await writeFile(join(project, 'package.json'), '{"private":true,"type":"module"}\n');
  return project;
}
function run(project, args, ok = true) {
  const result = spawnSync(process.execPath, [cli, ...args, '--cwd', project, '--json'], { encoding: 'utf8' });
  const data = JSON.parse(result.stdout);
  assert.equal(result.status, ok ? 0 : 1, `${result.stdout}\n${result.stderr}`);
  assert.equal(result.stderr, '');
  assert.equal(data.ok, ok);
  return data;
}
const install = (project, agent = 'all', args = [], ok = true) => run(project, ['harness', '--registry', bundle, '--agent', agent, ...args], ok);
const readJson = async (project, path) => JSON.parse(await readFile(join(project, path), 'utf8'));

test('React·UI 없이 선택한 에이전트의 전체 하네스를 설치하고 재실행은 재사용해요', async () => {
  const project = await fixture();
  const original = await readFile(join(project, 'package.json'), 'utf8');
  const first = install(project, 'claude');
  assert.equal(first.version, harnessVersion);
  assert.ok(first.files.every(file => file.path.startsWith('.claude/')));
  // 터미널 기본 출력에서도 필요한 재로딩·신뢰 절차를 바로 볼 수 있어야 해요.
  const terminal = execFileSync(process.execPath, [cli, 'harness', '--agent', 'all', '--registry', bundle, '--cwd', project, '--dry-run'], { encoding: 'utf8' });
  assert.ok(terminal.includes(`하네스 ${harnessVersion}`));
  assert.match(terminal, /\/reload-skills/);
  assert.match(terminal, /\/hooks/);
  assert.match(terminal, /MCP/);
  await assert.rejects(readFile(join(project, '.agents/skills/eli/SKILL.md')));
  const record = await readJson(project, 'eli.harness.json');
  assert.equal(record.installerVersion, toolVersion);
  for (const file of record.files) assert.equal(digest(await readFile(join(project, file.path))), file.sha256);
  assert.equal((await readFile(join(project, '.claude/skills/eli/VERSION'), 'utf8')).trim(), record.version);
  const second = install(project, 'claude');
  assert.ok(second.files.every(file => file.action === 'reuse'));
  assert.equal(await readFile(join(project, 'package.json'), 'utf8'), original);
  await assert.rejects(readFile(join(project, 'eli.json')));
  await assert.rejects(readFile(join(project, 'package-lock.json')));
});

test('기존 설정·다른 훅을 보존하고 두 에이전트를 중복 없이 병합해요', async () => {
  const project = await fixture();
  await mkdir(join(project, '.claude'));
  await writeFile(join(project, '.claude/settings.json'), JSON.stringify({ theme: 'dark', hooks: { SessionStart: [{ hooks: [{ type: 'command', command: 'echo existing' }] }] } }));
  await chmod(join(project, '.claude/settings.json'), 0o660);
  install(project, 'claude');
  install(project, 'codex');
  install(project, 'all');
  const settings = await readJson(project, '.claude/settings.json');
  assert.equal(settings.theme, 'dark');
  assert.equal((await stat(join(project, '.claude/settings.json'))).mode & 0o777, 0o660);
  assert.equal(settings.hooks.SessionStart.length, 2);
  assert.equal(settings.hooks.SessionStart[0].hooks[0].command, 'echo existing');
  assert.equal(settings.hooks.PostToolUse.length, 1);
  const codex = await readJson(project, '.codex/hooks.json');
  assert.equal(codex.hooks.SessionStart.length, 1);
  assert.equal(codex.hooks.PostToolUse, undefined);
  assert.deepEqual((await readJson(project, 'eli.harness.json')).agents, ['claude', 'codex']);
  // 설치한 명령 자체가 Git 없는 프로젝트에서도 실행되는지 확인해요.
  const hook = spawnSync(codex.hooks.SessionStart[0].hooks[0].command, { cwd: project, shell: true, encoding: 'utf8' });
  assert.equal(hook.status, 0, hook.stderr);
  assert.match(hook.stdout, /eli-docs/);
});

test('dry-run은 설정·파일·설치 기록을 만들지 않고 계획과 신뢰 안내만 알려줘요', async () => {
  const project = await fixture();
  const result = install(project, 'all', ['--dry-run']);
  assert.equal(result.dryRun, true);
  assert.ok(result.nextSteps.some(step => step.includes('/hooks')));
  for (const path of ['eli.harness.json', '.claude/settings.json', '.codex/hooks.json']) await assert.rejects(readFile(join(project, path)));
});

test('하네스만 설치한 프로젝트의 status 기본 출력도 하네스 상태를 표시해요', async () => {
  const project = await fixture();
  install(project, 'claude');
  const result = spawnSync(process.execPath, [cli, 'status', '--cwd', project], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /UI 없음/);
  assert.match(result.stdout, new RegExp(`하네스 ${harnessVersion.replaceAll('.', '\\.')}\\n\\{"unchanged":\\d+\\}`));
});

test('사용자 수정·누락은 status로 구분하고 수정 파일은 덮어쓰지 않아요', async () => {
  const project = await fixture();
  install(project, 'all');
  const path = '.agents/skills/eli/SKILL.md';
  await appendFile(join(project, path), '\n사용자 수정\n');
  await rm(join(project, '.claude/skills/eli/VERSION'));
  const before = await readFile(join(project, '.claude/settings.json'));
  const result = install(project, 'all', [], false);
  assert.equal(result.error.code, 'FILE_CONFLICT');
  assert.match(await readFile(join(project, path), 'utf8'), /사용자 수정/);
  assert.deepEqual(await readFile(join(project, '.claude/settings.json')), before);
  const status = run(project, ['status']);
  assert.equal(status.version, null);
  assert.equal(status.harness.files.find(file => file.path === path).state, 'modified');
  assert.equal(status.harness.files.find(file => file.path === '.claude/skills/eli/VERSION').state, 'missing');
});

test('잘못된 설정·심볼릭 링크에는 쓰지 않아요', async () => {
  const project = await fixture();
  await mkdir(join(project, '.claude'));
  await writeFile(join(project, '.claude/settings.json'), '{');
  assert.equal(install(project, 'all', [], false).error.code, 'INVALID_DATA');
  await assert.rejects(readFile(join(project, 'eli.harness.json')));
  await assert.rejects(readFile(join(project, '.claude/skills/eli/SKILL.md')));
  const another = await fixture();
  const outside = await fixture();
  await symlink(outside, join(another, '.claude'), 'junction');
  assert.equal(install(another, 'claude', [], false).error.code, 'UNSAFE_PATH');
  await assert.rejects(readFile(join(outside, 'settings.json')));
});

test('설정 두 개를 병합하다 실패하면 기존 설정과 새 파일을 함께 복구해요', async () => {
  const project = await fixture();
  for (const agent of ['.claude', '.codex']) await mkdir(join(project, agent));
  const original = '{"theme":"preserve"}\n';
  await writeFile(join(project, '.claude/settings.json'), original);
  await writeFile(join(project, '.codex/hooks.json'), '{}');
  await writeFile(join(project, '.codex/hooks.json.eli-pending'), '다른 작업');
  install(project, 'all', [], false);
  assert.equal(await readFile(join(project, '.claude/settings.json'), 'utf8'), original);
  assert.equal(await readFile(join(project, '.codex/hooks.json.eli-pending'), 'utf8'), '다른 작업');
  await assert.rejects(readFile(join(project, '.claude/skills/eli/SKILL.md')));
  await assert.rejects(readFile(join(project, 'eli.harness.json')));
});

test('소스로 설치된 UI를 훅과 스킬이 인식하고 npm 패키지를 요구하지 않아요', async () => {
  const project = await fixture();
  await writeFile(join(project, 'package.json'), '{"private":true,"dependencies":{"react":"19.3.0"}}');
  await mkdir(join(project, 'node_modules/react'), { recursive: true });
  await writeFile(join(project, 'node_modules/react/package.json'), '{"name":"react","version":"19.3.0"}');
  run(project, ['init', '--registry', join(root, '.artifacts/registry'), '--dir', 'src/ui']);
  run(project, ['add', 'button']);
  install(project, 'all');
  const output = execFileSync(process.execPath, [join(project, '.claude/hooks/eli/session-start.mjs')], { cwd: project, encoding: 'utf8' });
  assert.match(output, /소스 방식/);
  assert.match(output, /eli\.lock\.json/);
  assert.match(output, /전체 @eli-design\/ui를 추가하지 않아요/);
  const status = run(project, ['status']);
  assert.equal(status.entries.find(entry => entry.id === 'button').path, 'src/ui/button.tsx');
  assert.equal(status.harness.version, harnessVersion);
  assert.equal(status.harness.installerVersion, toolVersion);
  await assert.rejects(readFile(join(project, 'node_modules/@eli-design/ui/package.json')));
});

test('손상·경로 탈출·다른 버전의 하네스를 받지 않아요', async () => {
  for (const [change, code] of [
    [data => { data.files[0].content += 'tamper'; }, 'INTEGRITY_MISMATCH'],
    [data => { data.files[0].path = '../outside'; }, 'UNSAFE_PATH'],
    [data => { data.schemaVersion = 2; }, 'INVALID_DATA'],
  ]) {
    const project = await fixture();
    const altered = await mkdtemp(join(work, 'bundle-'));
    const data = JSON.parse(await readFile(join(bundle, 'harness.json'), 'utf8'));
    change(data);
    await writeFile(join(altered, 'harness.json'), JSON.stringify(data));
    const result = run(project, ['harness', '--registry', altered, '--agent', 'all'], false);
    assert.equal(result.error.code, code);
    await assert.rejects(readFile(join(project, 'eli.harness.json')));
  }
  const project = await fixture();
  install(project);
  const altered = await mkdtemp(join(work, 'version-'));
  const data = JSON.parse(await readFile(join(bundle, 'harness.json'), 'utf8'));
  data.version = '999.0.0';
  await writeFile(join(altered, 'harness.json'), JSON.stringify(data));
  assert.equal(run(project, ['harness', '--registry', altered, '--agent', 'all'], false).error.code, 'VERSION_MISMATCH');
});

test('하네스 전용 Release만 선택하고 UI·CLI Release는 건너뛰어요', async () => {
  const { latestRelease } = await import(pathToFileURL(join(work, 'tool/node_modules/eli-design/dist/registry.mjs')));
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify([
    { tag_name: 'cli-v0.2.0', assets: [{ name: 'harness.json' }] },
    { tag_name: 'harness-v0.3.0', draft: true, assets: [{ name: 'harness.json' }] },
    { tag_name: 'v0.1.0', assets: [{ name: 'registry.json' }] },
    { tag_name: 'harness-v0.1.0', assets: [{ name: 'harness.json' }] },
  ]));
  try { assert.equal(await latestRelease([], 'harness-v', 'harness.json'), 'https://github.com/ELI-LDS/ELI/releases/download/harness-v0.1.0/harness.json'); }
  finally { globalThis.fetch = original; }
});

test('하네스 기록의 임의 경로와 선택 없는 실행을 거부해요', async () => {
  const project = await fixture();
  assert.equal(run(project, ['harness', '--registry', bundle], false).error.code, 'INVALID_ARGUMENT');
  install(project, 'all');
  const record = await readJson(project, 'eli.harness.json');
  record.files[0].path = 'README.md';
  await writeFile(join(project, 'eli.harness.json'), JSON.stringify(record));
  assert.equal(run(project, ['status'], false).error.code, 'INVALID_RECORD');
});
