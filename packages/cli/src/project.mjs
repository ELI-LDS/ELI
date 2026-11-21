import { constants, existsSync, fchmodSync, lstatSync, mkdirSync, openSync, closeSync, readFileSync, realpathSync, renameSync, rmSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import semver from 'semver';
import { ensure, CliError } from './errors.mjs';
import { hash, json, parseJson, safePath } from './registry.mjs';

export const CONFIG = 'eli.json';
export const RECORD = 'eli.lock.json';
const LOCK = '.eli-install.lock';
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export function projectAt(cwd) {
  const root = realpathSync(resolve(cwd));
  ensure(lstatSync(root).isDirectory(), 'INVALID_PROJECT', '프로젝트 폴더를 지정해요.');
  const manifest = readJson(root, 'package.json');
  ensure(isObject(manifest), 'INVALID_PROJECT', '현재 폴더에 package.json이 필요해요. --cwd로 프로젝트를 지정해요.');
  return { root, manifest };
}

/** 상위·하위 심볼릭 링크를 따라 프로젝트 밖에 쓰지 않도록 매번 확인해요. */
export function targetPath(root, relative, agentPaths = false) {
  safePath(relative, agentPaths);
  let target = root;
  const parts = relative.split('/');
  for (const [index, part] of parts.entries()) {
    target = join(target, part);
    let stat;
    try { stat = lstatSync(target); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    ensure(!stat.isSymbolicLink(), 'UNSAFE_PATH', '심볼릭 링크 경로에는 설치하지 않아요.', { path: relative });
    ensure(index === parts.length - 1 || stat.isDirectory(), 'FILE_CONFLICT', '폴더 경로에 파일이 있어요.', { path: relative });
  }
  return target;
}

export function bytesAt(root, path, agentPaths = false) {
  const target = targetPath(root, path, agentPaths);
  try {
    ensure(lstatSync(target).isFile(), 'FILE_CONFLICT', '일반 파일만 읽을 수 있어요.', { path });
    return readFileSync(target);
  } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

function readJson(root, path) {
  const bytes = bytesAt(root, path);
  return bytes === null ? null : parseJson(bytes.toString('utf8'), path);
}

export function loadConfig(project) {
  const config = readJson(project.root, CONFIG);
  ensure(config, 'NOT_INITIALIZED', '먼저 eli-design init을 실행해요.');
  ensure(isObject(config) && Object.keys(config).sort().join(',') === 'directory,registry,registrySha256,schemaVersion,version' && config.schemaVersion === 1 && semver.valid(config.version) && typeof config.registry === 'string' && /^[a-f0-9]{64}$/.test(config.registrySha256), 'INVALID_CONFIG', 'eli.json의 형식을 확인해요.');
  safePath(config.directory);
  targetPath(project.root, config.directory);
  return config;
}

export function loadRecord(project, config) {
  const bytes = bytesAt(project.root, RECORD);
  if (bytes === null) return { bytes: null, record: null };
  const record = parseJson(bytes.toString('utf8'), RECORD);
  ensure(isObject(record) && record.schemaVersion === 1 && record.mode === 'source' && record.version === config.version && record.directory === config.directory && record.registry === config.registry && record.registrySha256 === config.registrySha256, 'INVALID_RECORD', '설치 기록과 설정의 버전·경로가 달라요.');
  for (const name of ['requested', 'resolved', 'files', 'entries']) ensure(Array.isArray(record[name]), 'INVALID_RECORD', '설치 기록의 형식이 잘못됐어요.');
  ensure([...record.requested, ...record.resolved].every(id => typeof id === 'string' && /^[_a-z0-9-]+$/.test(id)), 'INVALID_RECORD', '설치 기록의 항목 ID가 잘못됐어요.');
  ensure(new Set(record.requested).size === record.requested.length && new Set(record.resolved).size === record.resolved.length && new Set(record.entries.map(entry => entry?.id)).size === record.entries.length, 'INVALID_RECORD', '설치 항목 기록이 중복돼요.');
  const paths = new Set();
  for (const file of record.files) {
    ensure(isObject(file) && typeof file.owner === 'string' && record.resolved.includes(file.owner) && /^[a-f0-9]{64}$/.test(file.sha256), 'INVALID_RECORD', '설치 파일 기록이 잘못됐어요.');
    safePath(file.path);
    ensure(file.path.startsWith(`${config.directory}/`) && !paths.has(file.path), 'INVALID_RECORD', '설치 기록의 경로가 중복되거나 폴더 밖에 있어요.');
    paths.add(file.path);
  }
  for (const entry of record.entries) ensure(isObject(entry) && record.resolved.includes(entry.id) && paths.has(entry.path) && typeof entry.export === 'string' && /^[A-Za-z_$][\w$]*$/.test(entry.export), 'INVALID_RECORD', '설치 진입점 기록이 잘못됐어요.');
  ensure(record.requested.every(id => record.entries.some(entry => entry.id === id)) && record.resolved.every(id => record.files.some(file => file.owner === id)), 'INVALID_RECORD', '설치 항목에 연결된 파일이나 진입점이 없어요.');
  return { bytes, record };
}

/** 실행 도구의 패키지 매니저 대신 소비 프로젝트의 선언과 lockfile을 기준으로 판단해요. */
export function projectManager(project) {
  const locks = [['package-lock.json', 'npm'], ['npm-shrinkwrap.json', 'npm'], ['pnpm-lock.yaml', 'pnpm'], ['yarn.lock', 'yarn'], ['bun.lock', 'bun'], ['bun.lockb', 'bun']];
  const detected = new Set(locks.filter(([path]) => existsSync(join(project.root, path))).map(([, manager]) => manager));
  const declared = project.manifest.packageManager?.match(/^(npm|pnpm|yarn|bun)@/);
  ensure(detected.size <= 1 && (!declared || detected.size === 0 || detected.has(declared[1])), 'PACKAGE_MANAGER_CONFLICT', 'packageManager와 lockfile을 하나의 패키지 매니저로 맞춰요.');
  return declared?.[1] ?? [...detected][0] ?? 'npm';
}

/** 기존 React를 교체하지 않아요. 선언과 실제 설치 버전을 함께 확인하고 부족한 조건을 알려줘요. */
export function checkPeers(project, peers) {
  const manager = projectManager(project);
  const requirements = [];
  for (const [name, ranges] of peers) {
    const declared = project.manifest.dependencies?.[name] ?? project.manifest.devDependencies?.[name] ?? project.manifest.peerDependencies?.[name];
    ensure(typeof declared === 'string', 'MISSING_DEPENDENCY', `${name}을 프로젝트에 먼저 설치해요.`, { name, ranges: [...ranges], manager, command: `${manager === 'npm' ? 'npm install' : `${manager} add`} ${name}@'${[...ranges].join(' ')}'` });
    let version;
    try {
      if (existsSync(join(project.root, '.pnp.cjs'))) {
        // PnP 프로젝트는 node_modules 경로를 가정하지 않고 Yarn의 실행 환경에서 해석해요.
        version = JSON.parse(execFileSync('yarn', ['node', '-p', `JSON.stringify(require(${JSON.stringify(`${name}/package.json`)}).version)`], { cwd: project.root, encoding: 'utf8', timeout: 30_000, stdio: ['ignore', 'pipe', 'pipe'] }).trim());
      } else {
        const require = createRequire(join(project.root, 'package.json'));
        version = JSON.parse(readFileSync(require.resolve(`${name}/package.json`), 'utf8')).version;
      }
    } catch { throw new CliError('MISSING_DEPENDENCY', `${name}의 설치를 확인할 수 없어요. 프로젝트의 패키지 매니저로 install을 실행해요.`, { name, declared, manager }); }
    ensure(semver.valid(version) && (!semver.validRange(declared) || semver.satisfies(version, declared)) && [...ranges].every(range => semver.validRange(range) && semver.satisfies(version, range)), 'INCOMPATIBLE_DEPENDENCY', `${name}의 설치 버전이 선언 또는 UI 요구 범위와 달라요. 기존 의존성은 자동으로 바꾸지 않아요.`, { name, version, declared, ranges: [...ranges] });
    requirements.push({ name, version, ranges: [...ranges] });
  }
  return { manager, requirements };
}

export function createPlan(project, config, registry, selection, requested, previous) {
  const files = [];
  const recorded = new Map(previous.record?.files.map(file => [file.path, file]) ?? []);
  const conflicts = [];
  for (const file of selection.files.values()) {
    const path = `${config.directory}/${file.path}`;
    const bytes = bytesAt(project.root, path);
    const prior = recorded.get(path);
    if ((prior && (prior.sha256 !== file.sha256 || prior.owner !== file.owner)) || (bytes !== null && hash(bytes) !== file.sha256)) conflicts.push(path);
    files.push({ path, sha256: file.sha256, owner: file.owner, action: bytes === null ? 'add' : 'reuse' });
  }
  ensure(conflicts.length === 0, 'FILE_CONFLICT', '기존 파일과 내용이 달라요. 사용자 수정 파일은 덮어쓰지 않아요.', { paths: conflicts });
  const entries = [...selection.selected.values()].filter(item => item.entry).map(item => ({ id: item.id, path: `${config.directory}/${item.entry.path}`, export: item.entry.export }));
  const newFiles = new Map(recorded);
  for (const { path, sha256, owner } of files) newFiles.set(path, { path, sha256, owner });
  const allEntries = new Map(previous.record?.entries.map(entry => [entry.id, entry]) ?? []);
  for (const entry of entries) allEntries.set(entry.id, entry);
  const record = {
    schemaVersion: 1, mode: 'source', registry: config.registry, registrySha256: config.registrySha256,
    version: registry.index.version, directory: config.directory,
    requested: [...new Set([...(previous.record?.requested ?? []), ...requested])].sort(),
    resolved: [...new Set([...(previous.record?.resolved ?? []), ...selection.selected.keys()])].sort(),
    entries: [...allEntries.values()].sort((a, b) => a.id.localeCompare(b.id)),
    files: [...newFiles.values()].sort((a, b) => a.path.localeCompare(b.path)),
  };
  return { files, entries, record };
}

function makeParents(root, relative, created, agentPaths) {
  const parts = relative.split('/').slice(0, -1);
  for (let index = 1; index <= parts.length; index++) {
    const path = parts.slice(0, index).join('/');
    const target = targetPath(root, path, agentPaths);
    if (!existsSync(target)) { mkdirSync(target); created.push(target); }
  }
}

function writeExclusive(root, path, content, directories, agentPaths, mode = undefined) {
  makeParents(root, path, directories, agentPaths);
  const target = targetPath(root, path, agentPaths);
  const fd = openSync(target, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY | (constants.O_NOFOLLOW ?? 0), mode ?? 0o644);
  try {
    // 기존 설정의 권한은 umask의 영향을 받지 않고 원래 값으로 유지해요.
    if (mode !== undefined) fchmodSync(fd, mode);
    writeFileSync(fd, content);
  }
  catch (error) { closeSync(fd); unlinkSync(target); throw error; }
  closeSync(fd);
  return target;
}

/** 실패하면 이번 파일과 병합한 설정을 함께 되돌려 기록과 실제 설치가 어긋나지 않게 해요. */
export function writeProject(project, changes, recordBefore = undefined, verify = () => {}, { replacements = new Map(), agentPaths = false } = {}) {
  const lock = join(project.root, LOCK);
  try { mkdirSync(lock); }
  catch { throw new CliError('PROJECT_BUSY', '다른 설치가 진행 중이에요. .eli-install.lock을 확인해요.'); }
  const created = [];
  const directories = [];
  const replaced = [];
  const mutable = new Map(replacements);
  if (recordBefore !== undefined) mutable.set(RECORD, recordBefore);
  try {
    verify();
    for (const [path, content] of changes) {
      if (mutable.has(path)) continue;
      created.push(writeExclusive(project.root, path, content, directories, agentPaths));
    }
    for (const [path, before] of mutable) {
      const next = changes.get(path);
      ensure(next !== undefined, 'INVALID_RECORD', '교체할 파일의 내용이 없어요.', { path });
      const actual = bytesAt(project.root, path, agentPaths);
      ensure((actual === null && before === null) || (actual !== null && before !== null && actual.equals(before)), 'PROJECT_BUSY', '설치 중 설정이나 기록이 변경됐어요.', { path });
      if (actual === null) created.push(writeExclusive(project.root, path, next, directories, agentPaths));
      else if (!actual.equals(Buffer.from(next))) {
        const temporary = path === RECORD ? 'eli.lock.pending.json' : `${path}.eli-pending`;
        const mode = lstatSync(targetPath(project.root, path, agentPaths)).mode & 0o777;
        created.push(writeExclusive(project.root, temporary, next, directories, agentPaths, mode));
        renameSync(targetPath(project.root, temporary, agentPaths), targetPath(project.root, path, agentPaths));
        created.pop();
        replaced.push({ path, before, after: Buffer.from(next), mode });
      }
    }
  } catch (error) {
    // 설정 여러 개를 병합하던 중 실패해도 이미 바꾼 파일과 새로 복사한 파일을 함께 되돌려요.
    for (const { path, before, after, mode } of replaced.reverse()) {
      const current = bytesAt(project.root, path, agentPaths);
      ensure(current?.equals(after), 'PROJECT_BUSY', '복구 중 파일이 변경됐어요. 기존 변경을 확인해요.', { path });
      const temporary = path === RECORD ? 'eli.lock.pending.json' : `${path}.eli-pending`;
      created.push(writeExclusive(project.root, temporary, before, directories, agentPaths, mode));
      renameSync(targetPath(project.root, temporary, agentPaths), targetPath(project.root, path, agentPaths));
      created.pop();
    }
    for (const path of created.reverse()) unlinkSync(path);
    for (const directory of directories.reverse()) rmdirSync(directory);
    throw error;
  } finally { rmSync(lock, { recursive: true }); }
}

export function statusOf(project, config) {
  const { record } = loadRecord(project, config);
  return {
    version: config.version, directory: config.directory, entries: record?.entries ?? [],
    files: (record?.files ?? []).map(file => {
      const bytes = bytesAt(project.root, file.path);
      return { ...file, state: bytes === null ? 'missing' : hash(bytes) === file.sha256 ? 'unchanged' : 'modified' };
    }),
  };
}

export function defaultDirectory(project) {
  const source = targetPath(project.root, 'src');
  return existsSync(source) && lstatSync(source).isDirectory() ? 'src/components/eli' : 'components/eli';
}

export function applyPlan(project, config, selection, plan, previous) {
  const changes = new Map();
  for (const file of plan.files.filter(file => file.action === 'add')) changes.set(file.path, selection.files.get(file.path.slice(config.directory.length + 1)).content);
  changes.set(RECORD, json(plan.record));
  writeProject(project, changes, previous.bytes, () => {
    ensure(json(loadConfig(project)) === json(config), 'PROJECT_BUSY', '설치 중 설정이 변경됐어요.');
    for (const file of plan.files) {
      const bytes = bytesAt(project.root, file.path);
      ensure(file.action === 'add' ? bytes === null : bytes !== null && hash(bytes) === file.sha256, 'FILE_CONFLICT', '계획을 만든 뒤 파일이 변경됐어요.', { path: file.path });
    }
  });
}
