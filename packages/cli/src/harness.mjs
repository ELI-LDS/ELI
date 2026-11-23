import semver from 'semver';
import { readFile } from 'node:fs/promises';
import { ensure } from './errors.mjs';
import { hash, json, latestRelease, parseJson, readResource, registryUrl, safePath } from './registry.mjs';
import { bytesAt, targetPath, writeProject } from './project.mjs';
import { matches } from './schema.mjs';

const schema = JSON.parse(await readFile(new URL('./harness.schema.json', import.meta.url), 'utf8'));
const RECORD = 'eli.harness.json';
const agents = ['claude', 'codex'];
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const ownedPath = path => typeof path === 'string' && ['.claude/skills/', '.agents/skills/', '.claude/hooks/eli/', '.codex/hooks/eli/'].some(prefix => path.startsWith(prefix));
const equals = (a, b) => a === null ? b === null : b !== null && a.equals(b);

function recordOf(project) {
  const bytes = bytesAt(project.root, RECORD);
  if (bytes === null) return { bytes, record: null };
  const record = parseJson(bytes.toString('utf8'), RECORD);
  ensure(object(record) && record.schemaVersion === 1 && record.kind === 'harness' && semver.valid(record.version) && semver.valid(record.installerVersion) && typeof record.registry === 'string' && /^[a-f0-9]{64}$/.test(record.sha256) && Array.isArray(record.agents) && record.agents.length && record.agents.every(agent => agents.includes(agent)) && new Set(record.agents).size === record.agents.length && Array.isArray(record.files) && record.files.length > 0, 'INVALID_RECORD', '하네스 설치 기록을 확인해요.');
  const paths = new Set();
  for (const file of record.files) {
    ensure(object(file) && ownedPath(file.path) && /^[a-f0-9]{64}$/.test(file.sha256) && !paths.has(file.path), 'INVALID_RECORD', '하네스 파일 기록을 확인해요.');
    targetPath(project.root, file.path, true);
    paths.add(file.path);
  }
  return { bytes, record };
}

export function harnessStatus(project) {
  const { record } = recordOf(project);
  if (!record) return null;
  return { version: record.version, installerVersion: record.installerVersion, agents: record.agents, registry: record.registry, files: record.files.map(file => {
    const bytes = bytesAt(project.root, file.path, true);
    return { ...file, state: bytes === null ? 'missing' : hash(bytes) === file.sha256 ? 'unchanged' : 'modified' };
  }) };
}

/** 하네스는 UI 전체나 React를 받지 않고 별도 버전의 파일 묶음만 선택해요. */
async function loadHarness(project, values, previous) {
  const downloads = [];
  let url;
  if (values.registry) url = registryUrl(values.registry, project.root, 'harness.json');
  else if (values['harness-version']) {
    const version = values['harness-version'];
    ensure(semver.valid(version) === version, 'INVALID_ARGUMENT', '하네스 버전을 정확히 지정해요.');
    url = `https://github.com/ELI-team/ELI/releases/download/harness-v${version}/harness.json`;
  } else url = previous?.registry ?? await latestRelease(downloads, 'harness-v', 'harness.json');
  url = registryUrl(url, project.root, 'harness.json');
  const bytes = await readResource(url, downloads);
  const manifest = parseJson(bytes.toString('utf8'), '하네스');
  ensure(matches(manifest, schema, schema) && semver.valid(manifest.version) && manifest.files.length <= 1000, 'INVALID_DATA', '지원하는 하네스 v1 데이터가 아니에요.');
  // 이전 저장소 주소가 남은 설치 기록도 태그와 콘텐츠 버전의 대조를 유지해요.
  const tag = new URL(url).pathname.match(/^\/(?:ELI-team|ELI-LDS)\/ELI\/releases\/download\/harness-v([^/]+)\/harness\.json$/)?.[1];
  ensure(!tag || tag === manifest.version, 'VERSION_MISMATCH', '하네스 태그와 파일의 버전이 달라요.');
  ensure(!previous || previous.version === manifest.version, 'VERSION_MISMATCH', '다른 버전의 하네스로 덮어쓰지 않아요. 기존 설치와 변경 내역을 먼저 확인해요.');
  ensure(!previous || previous.sha256 === hash(bytes), 'INTEGRITY_MISMATCH', '고정한 하네스 배포 파일이 변경됐어요.');
  const files = new Map();
  for (const file of manifest.files) {
    ensure(object(file) && typeof file.path === 'string' && typeof file.content === 'string', 'INVALID_DATA', '하네스 파일 형식이 잘못됐어요.');
    safePath(file.path);
    ensure(['INSTALL.md', 'LICENSE', 'skills/eli/VERSION'].includes(file.path) || (/^skills\/[a-z0-9-]+\/(?:[\w.-]+\/)*[\w.-]+\.md$/.test(file.path)) || /^hooks\/[a-z0-9-]+\.mjs$/.test(file.path), 'UNSAFE_PATH', '하네스 스킬·훅 파일만 설치해요.', { path: file.path });
    ensure(!files.has(file.path) && /^[a-f0-9]{64}$/.test(file.sha256) && hash(file.content) === file.sha256, 'INTEGRITY_MISMATCH', '하네스 파일 해시나 소유권이 잘못됐어요.', { path: file.path });
    files.set(file.path, file.content);
  }
  for (const required of ['INSTALL.md', 'LICENSE', 'skills/eli/SKILL.md', 'skills/eli/VERSION', 'hooks/session-start.mjs', 'hooks/post-edit.mjs']) ensure(files.has(required), 'INVALID_DATA', '필수 하네스 파일이 없어요.', { path: required });
  ensure(files.get('skills/eli/VERSION').trim() === manifest.version, 'VERSION_MISMATCH', '스킬과 하네스 배포 버전이 달라요.');
  return { url, sha256: hash(bytes), manifest, files, downloads };
}

function destinations(bundle, selected) {
  const files = new Map();
  for (const agent of selected) {
    const skills = agent === 'claude' ? '.claude/skills' : '.agents/skills';
    const hooks = agent === 'claude' ? '.claude/hooks/eli' : '.codex/hooks/eli';
    for (const [path, content] of bundle.files) {
      const target = path.startsWith('skills/') ? `${skills}/${path.slice(7)}` : path.startsWith('hooks/') ? `${hooks}/${path.slice(6)}` : `${skills}/eli/${path}`;
      files.set(target, content);
    }
  }
  return files;
}

function registrations(agent) {
  if (agent === 'codex') return [{ event: 'SessionStart', command: 'node .codex/hooks/eli/session-start.mjs', path: '.codex/hooks/eli/session-start.mjs', group: {} }];
  return [
    { event: 'SessionStart', command: 'node "$CLAUDE_PROJECT_DIR"/.claude/hooks/eli/session-start.mjs', path: '.claude/hooks/eli/session-start.mjs', group: {} },
    { event: 'PostToolUse', command: 'node "$CLAUDE_PROJECT_DIR"/.claude/hooks/eli/post-edit.mjs', path: '.claude/hooks/eli/post-edit.mjs', group: { matcher: 'Edit|Write' } },
  ];
}

/** 기존 설정은 보존하고, 같은 훅의 중복 등록 없이 필요한 항목만 합쳐요. */
function mergeSettings(before, agent) {
  const settings = before === null ? {} : parseJson(before.toString('utf8'), '에이전트 설정');
  ensure(object(settings) && (settings.hooks === undefined || object(settings.hooks)), 'INVALID_DATA', '에이전트 hooks 설정의 형식을 확인해요.');
  settings.hooks ??= {};
  for (const { event, command, path, group } of registrations(agent)) {
    const existing = settings.hooks[event] ?? [];
    ensure(Array.isArray(existing), 'INVALID_DATA', `${event} 훅은 배열이어야 해요.`);
    const registered = existing.some(entry => Array.isArray(entry?.hooks) && entry.hooks.some(hook => typeof hook?.command === 'string' && (hook.command === command || hook.command.includes(path))));
    if (!registered) settings.hooks[event] = [...existing, { ...group, hooks: [{ type: 'command', command, timeout: 10 }] }];
  }
  return json(settings);
}

export async function installHarness(project, values) {
  ensure(['claude', 'codex', 'all'].includes(values.agent), 'INVALID_ARGUMENT', '--agent claude, codex 또는 all을 선택해요. 스킬·훅을 복사하고 해당 에이전트 설정에 훅을 등록해요.');
  const selected = values.agent === 'all' ? agents : [values.agent];
  const previous = recordOf(project);
  const bundle = await loadHarness(project, values, previous.record);
  const contents = destinations(bundle, selected);
  const before = new Map();
  const changes = new Map();
  const result = [];
  const recorded = new Map(previous.record?.files.map(file => [file.path, file]) ?? []);
  for (const [path, content] of contents) {
    const bytes = bytesAt(project.root, path, true);
    before.set(path, bytes);
    ensure(bytes === null || (hash(bytes) === hash(content) && (!recorded.has(path) || hash(bytes) === recorded.get(path).sha256)), 'FILE_CONFLICT', '기존 스킬·훅과 내용이 달라요. 수정 파일을 덮어쓰지 않아요.', { path });
    result.push({ path, action: bytes === null ? 'add' : 'reuse' });
    if (bytes === null) changes.set(path, content);
    recorded.set(path, { path, sha256: hash(content) });
  }
  const replacements = new Map();
  for (const agent of selected) {
    const path = agent === 'claude' ? '.claude/settings.json' : '.codex/hooks.json';
    const bytes = bytesAt(project.root, path, true);
    const merged = mergeSettings(bytes, agent);
    before.set(path, bytes);
    if (bytes === null || !bytes.equals(Buffer.from(merged))) { changes.set(path, merged); replacements.set(path, bytes); }
    result.push({ path, action: bytes === null ? 'add' : bytes.equals(Buffer.from(merged)) ? 'reuse' : 'merge' });
  }
  const record = { schemaVersion: 1, kind: 'harness', version: bundle.manifest.version, installerVersion: values.installerVersion, registry: bundle.url, sha256: bundle.sha256, agents: [...new Set([...(previous.record?.agents ?? []), ...selected])].sort(), files: [...recorded.values()].sort((a, b) => a.path.localeCompare(b.path)) };
  changes.set(RECORD, json(record));
  replacements.set(RECORD, previous.bytes);
  if (!values['dry-run']) writeProject(project, changes, undefined, () => {
    for (const [path, bytes] of before) ensure(equals(bytes, bytesAt(project.root, path, true)), 'PROJECT_BUSY', '설치 계획 이후 파일이 변경됐어요.', { path });
  }, { replacements, agentPaths: true });
  return { command: 'harness', dryRun: Boolean(values['dry-run']), version: record.version, agents: selected, registry: bundle.url, record: RECORD, files: result, downloads: bundle.downloads, nextSteps: [
    ...(selected.includes('claude') ? ['Claude Code에서 필요하면 /reload-skills로 스킬을 다시 읽어요.'] : []),
    ...(selected.includes('codex') ? ['Codex의 /hooks에서 등록한 훅을 확인하고 신뢰해요. 신뢰 전에는 실행되지 않아요.'] : []),
    '원격 MCP는 별도 연결이 필요해요. 주소가 준비되지 않았다면 조회가 필요한 작업을 미완료로 안내해요.',
  ] };
}
