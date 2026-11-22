#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { CliError, ensure } from './errors.mjs';
import { json, latestRegistry, loadRegistry, registryUrl, releaseRegistry, safePath, selectItems } from './registry.mjs';
import { CONFIG, RECORD, applyPlan, checkPeers, createPlan, defaultDirectory, loadConfig, loadRecord, projectAt, projectManager, statusOf, targetPath, writeProject } from './project.mjs';
import { harnessStatus, installHarness } from './harness.mjs';

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const help = `필요한 ELI 컴포넌트 소스만 추가해요.

eli-design init                       프로젝트 설정을 만들어요
eli-design list                       추가할 수 있는 컴포넌트를 확인해요
eli-design add button [modal ...]     선택한 UI와 필요한 파일만 추가해요
eli-design add --all                   모든 공개 UI 소스를 추가해요
eli-design status                     설치 경로·버전·사용자 수정을 확인해요
eli-design harness --agent <선택>     claude / codex / all의 스킬·훅을 설치해요

--cwd <폴더>                          현재 프로젝트 대신 사용할 폴더
--registry <주소 또는 폴더>           UI의 registry.json 또는 하네스의 harness.json
--harness-version <버전>              harness에서 사용할 독립 하네스 릴리스
--content-version <버전>              init/list에서 사용할 GitHub 콘텐츠 릴리스
--dir <상대 경로>                     init에서 사용할 소스 설치 폴더
--dry-run                             init/add/harness의 변경 계획만 확인
--json                                결과만 JSON으로 출력
--help                                도움말
--version                             설치 도구 버전

UI는 기존 React 프로젝트에서 사용해요. 하네스는 선택한 에이전트의 설정을 병합해요.
React·폰트·MCP는 자동 설치하지 않아요. 하네스는 harness 명령으로만 설치해요.
`;

async function run() {
  let parsed;
  try {
    parsed = parseArgs({ allowPositionals: true, options: {
      cwd: { type: 'string' }, registry: { type: 'string' }, 'content-version': { type: 'string' }, dir: { type: 'string' },
      all: { type: 'boolean' }, 'dry-run': { type: 'boolean' }, json: { type: 'boolean' }, help: { type: 'boolean', short: 'h' }, version: { type: 'boolean', short: 'v' },
      agent: { type: 'string' }, 'harness-version': { type: 'string' },
    } });
  } catch (error) { throw new CliError('INVALID_ARGUMENT', error.message); }
  const { values, positionals: [command, ...ids] } = parsed;
  for (const key of ['cwd', 'registry', 'content-version', 'dir', 'agent', 'harness-version']) ensure(values[key] === undefined || values[key].trim().length > 0, 'INVALID_ARGUMENT', `${key}에 비어 있지 않은 값을 입력해요.`);
  if (values.help || (!command && !values.version)) return { message: help };
  if (values.version) return { version: manifest.version };
  ensure(['init', 'list', 'add', 'status', 'harness'].includes(command), 'INVALID_ARGUMENT', 'init, list, add, status, harness 중 하나를 사용해요.');
  ensure(command === 'add' || (!ids.length && !values.all), 'INVALID_ARGUMENT', '컴포넌트 ID와 --all은 add에서만 사용해요.');
  ensure(command === 'init' || !values.dir, 'INVALID_ARGUMENT', '--dir은 init에서만 사용해요.');
  ensure(['init', 'list', 'harness'].includes(command) || (!values.registry && !values['content-version']), 'INVALID_ARGUMENT', '설치된 UI 버전은 eli.json에 고정돼요. add에서 레지스트리를 바꾸지 않아요.');
  ensure(command === 'harness' || (!values.agent && !values['harness-version']), 'INVALID_ARGUMENT', '--agent와 --harness-version은 harness에서만 사용해요.');
  ensure(command !== 'harness' || (!ids.length && !values['content-version'] && !values.all), 'INVALID_ARGUMENT', 'harness는 --agent와 --harness-version으로 선택해요.');
  ensure(!values.registry || !values['content-version'], 'INVALID_ARGUMENT', '--registry와 --content-version 중 하나만 지정해요.');
  ensure(!values.registry || !values['harness-version'], 'INVALID_ARGUMENT', '--registry와 --harness-version 중 하나만 지정해요.');
  ensure(['init', 'add', 'harness'].includes(command) || !values['dry-run'], 'INVALID_ARGUMENT', '--dry-run은 init/add/harness에서 사용해요.');
  const project = projectAt(values.cwd ?? process.cwd());
  if (command === 'harness') return installHarness(project, { ...values, installerVersion: manifest.version });
  if (command === 'status') {
    const harness = harnessStatus(project);
    ensure(harness || existsSync(targetPath(project.root, CONFIG)), 'NOT_INITIALIZED', '먼저 init 또는 harness를 실행해요.');
    return { command, ...(existsSync(targetPath(project.root, CONFIG)) ? statusOf(project, loadConfig(project)) : { version: null, entries: [], files: [] }), harness };
  }
  let config;
  let url;
  const discovery = [];
  if (command === 'init') ensure(!existsSync(targetPath(project.root, CONFIG)), 'FILE_CONFLICT', 'eli.json이 이미 있어요. 기존 설정을 덮어쓰지 않아요.');
  if (command === 'init' || values.registry || values['content-version']) {
    url = values.registry ? registryUrl(values.registry, project.root) : values['content-version'] ? releaseRegistry(values['content-version']) : await latestRegistry(discovery);
  } else { config = loadConfig(project); url = registryUrl(config.registry, project.root); }
  const registry = await loadRegistry(url, config ? { version: config.version, sha256: config.registrySha256 } : {});
  registry.downloads.unshift(...discovery);
  const components = registry.index.items.filter(item => item.kind === 'component');
  if (command === 'list') return { command, version: registry.index.version, items: components.map(({ id, name, description }) => ({ id, name, description })), downloads: registry.downloads };
  if (command === 'init') {
    const directory = safePath(values.dir ?? defaultDirectory(project));
    targetPath(project.root, directory);
    config = { schemaVersion: 1, registry: url, registrySha256: registry.indexHash, version: registry.index.version, directory };
    const manager = projectManager(project);
    // 설정을 다시 만드는 init은 지원하지 않아요. 버전 변경은 별도 마이그레이션이 필요해요.
    const changes = new Map([[CONFIG, json(config)]]);
    if (!values['dry-run']) writeProject(project, changes);
    return { command, dryRun: Boolean(values['dry-run']), config, manager, files: [{ path: CONFIG, action: 'add' }], downloads: registry.downloads, nextSteps: [`UI 소스 설치 경로: ${directory}`] };
  }
  ensure((values.all && ids.length === 0) || (!values.all && ids.length > 0), 'INVALID_ARGUMENT', '컴포넌트 ID 또는 --all 중 하나를 선택해요.');
  const requested = [...new Set(values.all ? components.map(item => item.id) : ids)].sort();
  const previous = loadRecord(project, config);
  const selection = await selectItems(registry, requested);
  const dependencies = checkPeers(project, selection.peers);
  const plan = createPlan(project, config, registry, selection, requested, previous);
  if (!values['dry-run']) applyPlan(project, config, selection, plan, previous);
  return {
    command, dryRun: Boolean(values['dry-run']), version: registry.index.version, requested,
    resolved: [...selection.selected.keys()].sort(), entries: plan.entries, files: plan.files,
    ...dependencies, record: RECORD, downloads: registry.downloads,
  };
}

const structured = process.argv.includes('--json');
try {
  const result = await run();
  if (structured) process.stdout.write(json({ ok: true, ...result }));
  else if (result.message) process.stdout.write(result.message);
  else if (!result.command) process.stdout.write(`${result.version}\n`);
  else if (result.command === 'list') process.stdout.write(result.items.map(item => `${item.id}\t${item.description}`).join('\n') + '\n');
  else {
    const counts = files => JSON.stringify(files.reduce((sum, file) => { const state = file.action ?? file.state; sum[state] = (sum[state] ?? 0) + 1; return sum; }, {}));
    // 하네스만 설치한 프로젝트의 status에는 UI 버전과 config가 없어요.
    process.stdout.write(`${result.dryRun ? '변경 미리보기' : '완료'}: ${result.command} (${result.command === 'harness' ? '하네스' : 'UI'} ${result.version ?? result.config?.version ?? '없음'})\n`);
    for (const entry of result.entries ?? []) process.stdout.write(`${entry.export}: ${entry.path}\n`);
    process.stdout.write(`${counts(result.files)}\n`);
    if (result.command === 'status' && result.harness) process.stdout.write(`하네스 ${result.harness.version}\n${counts(result.harness.files)}\n`);
    for (const step of result.nextSteps ?? []) process.stdout.write(`${step}\n`);
  }
} catch (error) {
  const expected = error instanceof CliError;
  const code = expected ? error.code : ['EEXIST', 'EISDIR', 'ENOTDIR'].includes(error.code) ? 'FILE_CONFLICT' : 'IO_ERROR';
  const message = expected ? error.message : code === 'FILE_CONFLICT' ? '이미 파일이 있어요. 기존 파일을 보존하고 중단했어요.' : '파일을 읽거나 쓰지 못했어요. 경로와 권한을 확인해요.';
  const result = { ok: false, error: { code, message, details: expected ? error.details : {} } };
  if (structured) process.stdout.write(json(result));
  else process.stderr.write(`${message}\n${JSON.stringify(result.error.details)}\n`);
  process.exitCode = 1;
}
