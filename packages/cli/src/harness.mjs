import semver from 'semver';
import { readFile } from 'node:fs/promises';
import { ensure } from './errors.mjs';
import { hash, json, latestRelease, parseJson, readResource, registryUrl, safePath } from './registry.mjs';
import { bytesAt, targetPath, writeProject } from './project.mjs';
import { matches } from './schema.mjs';

const schema = JSON.parse(await readFile(new URL('./harness.schema.json', import.meta.url), 'utf8'));
const RECORD = '.eli/harness.json';
const agents = ['claude', 'codex'];
// 주소를 바꾸면 packages/harness의 skills/eli/SKILL.md, hooks/eli-docs.mjs와 함께 고쳐요.
const MCP = { name: 'eli-docs', url: 'https://eli-design.dev/mcp' };
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
  } else url = (!values.update && previous?.registry) || await latestRelease(downloads, 'harness-v', 'harness.json');
  url = registryUrl(url, project.root, 'harness.json');
  const bytes = await readResource(url, downloads);
  const manifest = parseJson(bytes.toString('utf8'), '하네스');
  ensure(matches(manifest, schema, schema) && semver.valid(manifest.version) && manifest.files.length <= 1000, 'INVALID_DATA', '지원하는 하네스 v1 데이터가 아니에요.');
  // 이전 저장소 주소가 남은 설치 기록도 태그와 콘텐츠 버전의 대조를 유지해요.
  const tag = new URL(url).pathname.match(/^\/(?:ELI-team|ELI-LDS)\/ELI\/releases\/download\/harness-v([^/]+)\/harness\.json$/)?.[1];
  ensure(!tag || tag === manifest.version, 'VERSION_MISMATCH', '하네스 태그와 파일의 버전이 달라요.');
  // --update만 다른 버전으로 옮겨요. 같은 버전이면 고정한 배포 파일과 같은지 그대로 확인해요.
  const changing = Boolean(values.update && previous && previous.version !== manifest.version);
  ensure(!previous || changing || previous.version === manifest.version, 'VERSION_MISMATCH', '다른 버전의 하네스로 덮어쓰지 않아요. 새 버전으로 옮기려면 harness --update를 사용해요.');
  ensure(!previous || changing || previous.sha256 === hash(bytes), 'INTEGRITY_MISMATCH', '고정한 하네스 배포 파일이 변경됐어요.');
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
  return { url, sha256: hash(bytes), manifest, files, downloads, changing };
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

/** Claude Code가 다음 세션부터 문서 서버를 불러오게 해요. 사용자가 이미 등록한 eli-docs는 바꾸지 않아요. */
function mergeMcp(before) {
  const config = before === null ? {} : parseJson(before.toString('utf8'), '.mcp.json');
  ensure(object(config) && (config.mcpServers === undefined || object(config.mcpServers)), 'INVALID_DATA', '.mcp.json의 mcpServers 형식을 확인해요.');
  if (config.mcpServers?.[MCP.name] !== undefined) return before.toString('utf8');
  config.mcpServers = { ...config.mcpServers, [MCP.name]: { type: 'http', url: MCP.url } };
  return json(config);
}

export async function installHarness(project, values) {
  const previous = recordOf(project);
  ensure(!values.update || previous.record, 'NOT_INITIALIZED', '업데이트할 하네스가 없어요. 먼저 harness --agent로 설치해요.');
  ensure(values.update ? values.agent === undefined || ['claude', 'codex', 'all'].includes(values.agent) : ['claude', 'codex', 'all'].includes(values.agent), 'INVALID_ARGUMENT', '--agent claude, codex 또는 all을 선택해요. 스킬·훅을 복사하고 해당 에이전트 설정에 훅을 등록해요.');
  const requested = values.agent === 'all' ? agents : values.agent ? [values.agent] : [];
  // 설치 기록의 버전은 하나라서, 업데이트는 이미 설치한 에이전트를 모두 함께 옮겨요.
  const selected = values.update ? agents.filter(agent => previous.record.agents.includes(agent) || requested.includes(agent)) : requested;
  const bundle = await loadHarness(project, values, previous.record);
  const contents = destinations(bundle, selected);
  const before = new Map();
  const changes = new Map();
  const replacements = new Map();
  const result = [];
  const recorded = new Map(previous.record?.files.map(file => [file.path, file]) ?? []);
  // shortcut: 새 버전에서 빠진 파일은 지우지 않고 기록에서만 빼서 알려요. 스킬을 지우거나 이름을 바꾸는 릴리스가 잦아지면 삭제와 복구를 writeProject에 더해요.
  const stale = bundle.changing ? [...recorded.keys()].filter(path => !contents.has(path)) : [];
  for (const path of stale) recorded.delete(path);
  const conflicts = [];
  for (const [path, content] of contents) {
    const bytes = bytesAt(project.root, path, true);
    before.set(path, bytes);
    const prior = recorded.get(path);
    if (bundle.changing) {
      // 설치 당시와 같은 파일만 새 내용으로 바꿔요. 사용자가 고친 파일이 하나라도 있으면 아무것도 바꾸지 않아요.
      if (bytes !== null && hash(bytes) !== hash(content) && (!prior || hash(bytes) !== prior.sha256)) conflicts.push(path);
      const action = bytes === null ? 'add' : hash(bytes) === hash(content) ? 'reuse' : 'replace';
      result.push({ path, action });
      if (action !== 'reuse') changes.set(path, content);
      if (action === 'replace') replacements.set(path, bytes);
    } else {
      ensure(bytes === null || (hash(bytes) === hash(content) && (!prior || hash(bytes) === prior.sha256)), 'FILE_CONFLICT', '기존 스킬·훅과 내용이 달라요. 수정 파일을 덮어쓰지 않아요.', { path });
      result.push({ path, action: bytes === null ? 'add' : 'reuse' });
      if (bytes === null) changes.set(path, content);
    }
    recorded.set(path, { path, sha256: hash(content) });
  }
  ensure(conflicts.length === 0, 'FILE_CONFLICT', '직접 수정한 스킬·훅이 있어 업데이트하지 않았어요. 수정을 유지할지 확인하고, 버릴 파일은 지운 뒤 다시 실행해요.', { paths: conflicts, from: previous.record?.version, to: bundle.manifest.version });
  const settings = selected.map(agent => [agent === 'claude' ? '.claude/settings.json' : '.codex/hooks.json', bytes => mergeSettings(bytes, agent)]);
  if (selected.includes('claude')) settings.push(['.mcp.json', mergeMcp]);
  for (const [path, merge] of settings) {
    const bytes = bytesAt(project.root, path, true);
    const merged = merge(bytes);
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
  if (values.update) return { command: 'harness', dryRun: Boolean(values['dry-run']), version: record.version, from: previous.record.version, updated: bundle.changing, agents: selected, registry: bundle.url, record: RECORD, files: result, stale, downloads: bundle.downloads, nextSteps: bundle.changing ? [
    '스킬과 훅이 새 버전으로 바뀌었어요. 이번 세션이 이미 읽은 지침은 이전 버전이에요. 필요한 스킬의 SKILL.md를 다시 읽고, Claude Code는 /reload-skills로 다시 불러와요.',
    ...(stale.length ? [`새 버전에 없는 파일이 남아 있어요. 쓰지 않는다면 지워요: ${stale.join(', ')}`] : []),
    ...(selected.includes('codex') ? ['Codex는 /hooks에서 바뀐 훅을 다시 확인하고 신뢰해요.'] : []),
    'DESIGN.md의 버전 표를 실제 설치된 하네스 버전으로 고쳐요.',
  ] : ['설치된 하네스가 이미 최신이에요.'] };
  return { command: 'harness', dryRun: Boolean(values['dry-run']), version: record.version, agents: selected, registry: bundle.url, record: RECORD, files: result, downloads: bundle.downloads, nextSteps: [
    // 설치한 세션에서 바로 셋업으로 이어가게 해요. MCP 서버는 세션을 시작할 때만 불러와요.
    ...(selected.includes('claude') ? [
      'Claude Code: 새 세션을 열지 않고 지금 세션에서 .claude/skills/eli-setup/SKILL.md를 읽고 그대로 진행해요. 스킬 명령이 보이지 않으면 /reload-skills로 다시 읽어요.',
      '가장 먼저 서비스 기획, 디자인 레퍼런스, 브랜드 컬러 세 질문을 AskUserQuestion 도구로 띄워요. 글로 묻지 않고, 사용자의 답을 받기 전에는 문서·토큰·페이지를 만들지 않아요.',
      `문서 서버 ${MCP.name} MCP를 .mcp.json에 등록했어요. 다음 세션부터 도구로 보여요. 지금 세션에 도구가 보이지 않으면 node .claude/hooks/eli/eli-docs.mjs <도구 이름> '<JSON 입력>'으로 같은 문서를 읽어요.`,
    ] : []),
    ...(selected.includes('codex') ? [
      'Codex의 /hooks에서 등록한 훅을 확인하고 신뢰해요. 신뢰 전에는 실행되지 않아요.',
      `Codex: codex mcp add ${MCP.name} --url ${MCP.url}로 문서 서버 MCP를 등록해요. 지금 세션에 도구가 보이지 않으면 node .codex/hooks/eli/eli-docs.mjs <도구 이름> '<JSON 입력>'으로 같은 문서를 읽고 .agents/skills/eli-setup/SKILL.md대로 이어서 진행해요. 서비스 기획, 디자인 레퍼런스, 브랜드 컬러 세 질문은 request_user_input_async 도구로 먼저 묻고 답을 받기 전에는 아무것도 만들지 않아요.`,
    ] : []),
  ] };
}
