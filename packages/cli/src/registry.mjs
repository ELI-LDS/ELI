import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import semver from 'semver';
import { CliError, ensure } from './errors.mjs';
import { matches } from './schema.mjs';

const schema = JSON.parse(await readFile(new URL('./registry.schema.json', import.meta.url), 'utf8'));
export const hash = value => createHash('sha256').update(value).digest('hex');
export const json = value => `${JSON.stringify(value, null, 2)}\n`;

export function parseJson(text, label) {
  try { return JSON.parse(text); }
  catch { throw new CliError('INVALID_DATA', `${label} JSON을 읽을 수 없어요.`); }
}

/** 설치 파일·설정·기록의 경로는 프로젝트 안에만 둘 수 있어요. */
export function safePath(path, agentPaths = false) {
  ensure(typeof path === 'string' && path.length > 0 && !/[\\:\x00-\x1f]/.test(path), 'UNSAFE_PATH', '올바른 상대 경로가 필요해요.', { path });
  // 설치 설정과 기록은 프로젝트 루트 대신 .eli 폴더에 모아요. 이 폴더의 JSON만 허용해요.
  if (/^\.eli(\/[a-z]+(\.[a-z]+)*\.json(\.eli-pending)?)?$/.test(path)) return path;
  ensure(path.split('/').every((part, index) => (agentPaths && index === 0 && ['.claude', '.agents', '.codex', '.mcp.json', '.mcp.json.eli-pending'].includes(part)) || (/^[a-zA-Z0-9_][a-zA-Z0-9_.-]*$/.test(part) && !['node_modules', 'harness', '__tests__'].includes(part) && !part.endsWith('.'))), 'UNSAFE_PATH', '프로젝트 내부의 소스 경로만 사용할 수 있어요.', { path });
  ensure(!path.split('/').some(part => /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part)), 'UNSAFE_PATH', '운영체제 예약 경로는 사용할 수 없어요.', { path });
  return path;
}

export function registryUrl(input, cwd, filename = 'registry.json') {
  if (/^https?:\/\//.test(input)) {
    const url = new URL(input);
    ensure(url.protocol === 'https:' || ['127.0.0.1', '[::1]', 'localhost'].includes(url.hostname), 'UNSAFE_REGISTRY', '원격 레지스트리는 HTTPS를 사용해요.');
    ensure(!url.username && !url.password && !url.search && !url.hash && url.pathname.endsWith(`/${filename}`), 'UNSAFE_REGISTRY', `${filename}의 주소를 입력해요.`);
    return url.href;
  }
  if (input.startsWith('file:')) return new URL(input).href;
  const path = resolve(cwd, input);
  return pathToFileURL(path.endsWith(`${sep}${filename}`) ? path : resolve(path, filename)).href;
}

/** 응답 크기와 시간을 제한하고 압축 해제된 JSON 바이트를 해시에 사용해요. */
export async function readResource(url, downloads) {
  let bytes;
  if (url.startsWith('file:')) bytes = await readFile(fileURLToPath(url));
  else {
    let response;
    try {
      let current = url;
      for (let attempt = 0; attempt < 5; attempt++) {
        response = await fetch(current, { signal: AbortSignal.timeout(30_000), redirect: 'manual' });
        if (![301, 302, 303, 307, 308].includes(response.status)) break;
        const next = new URL(response.headers.get('location'), current);
        await response.body?.cancel();
        ensure(new URL(url).hostname === 'github.com' && next.protocol === 'https:' && ['github.com', 'release-assets.githubusercontent.com', 'objects.githubusercontent.com'].includes(next.hostname), 'UNSAFE_REGISTRY', '허용되지 않은 레지스트리 리디렉션이에요.');
        current = next.href;
      }
    }
    catch (error) {
      if (error instanceof CliError) throw error;
      throw new CliError('REGISTRY_UNAVAILABLE', '레지스트리에 연결하지 못했어요.', { url });
    }
    ensure(response.ok, 'REGISTRY_UNAVAILABLE', '레지스트리를 받을 수 없어요. 게시된 릴리스인지 확인해요.', { url, status: response.status });
    const chunks = [];
    let length = 0;
    for await (const chunk of response.body) {
      length += chunk.length;
      ensure(length <= 16 * 1024 * 1024, 'INVALID_DATA', '레지스트리 응답이 너무 커요.');
      chunks.push(chunk);
    }
    bytes = Buffer.concat(chunks);
  }
  ensure(bytes.length <= 16 * 1024 * 1024, 'INVALID_DATA', '레지스트리 파일이 너무 커요.');
  downloads.push({ url, bytes: bytes.length });
  return bytes;
}

/** 콘텐츠 버전을 명시하면 이동하는 latest 대신 같은 Release의 파일만 사용해요. */
export function releaseRegistry(version) {
  ensure(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version), 'INVALID_ARGUMENT', '콘텐츠 버전을 숫자로 지정해요.');
  return `https://github.com/ELI-team/ELI/releases/download/v${version}/registry.json`;
}

export async function latestRegistry(downloads) {
  return latestRelease(downloads, 'v', 'registry.json');
}

/** UI·하네스·도구의 Release를 태그와 asset 이름으로 구분해 잘못된 콘텐츠를 선택하지 않아요. */
export async function latestRelease(downloads, prefix, filename) {
  const bytes = await readResource('https://api.github.com/repos/ELI-team/ELI/releases?per_page=100', downloads);
  const releases = parseJson(bytes.toString('utf8'), 'GitHub Release');
  ensure(Array.isArray(releases), 'INVALID_DATA', 'GitHub Release 목록이 올바르지 않아요.');
  // 설치 도구의 별도 Release를 콘텐츠 릴리스로 잘못 선택하지 않아요.
  const release = releases.find(item => !item.draft && !item.prerelease && typeof item.tag_name === 'string' && item.tag_name.startsWith(prefix) && /^\d+\.\d+\.\d+$/.test(item.tag_name.slice(prefix.length)) && item.assets?.some(asset => asset.name === filename));
  ensure(release, 'REGISTRY_UNAVAILABLE', '게시된 레지스트리가 없어요. 개발 검증에는 --registry 경로를 지정해요.');
  return `https://github.com/ELI-team/ELI/releases/download/${release.tag_name}/${filename}`;
}

export async function loadRegistry(url, expected = {}) {
  const downloads = [];
  const bytes = await readResource(url, downloads);
  const indexHash = hash(bytes);
  const index = parseJson(bytes.toString('utf8'), '레지스트리');
  ensure(matches(index, schema.$defs.index, schema) && semver.valid(index.version), 'INVALID_DATA', '지원하는 레지스트리 v1 목록이 아니에요.');
  const location = new URL(url);
  // 이전 저장소 주소가 남은 설치 기록도 태그와 콘텐츠 버전의 대조를 유지해요.
  const tag = location.hostname === 'github.com' && location.pathname.match(/^\/(?:ELI-team|ELI-LDS)\/ELI\/releases\/download\/v([^/]+)\/registry\.json$/)?.[1];
  ensure(!tag || tag === index.version, 'VERSION_MISMATCH', 'GitHub Release 태그와 콘텐츠 버전이 달라요.');
  ensure(!expected.version || index.version === expected.version, 'VERSION_MISMATCH', '설치된 UI와 콘텐츠 버전이 달라요.');
  ensure(!expected.sha256 || indexHash === expected.sha256, 'INTEGRITY_MISMATCH', '고정한 레지스트리 목록이 변경됐어요.');
  const descriptors = new Map();
  const filenames = new Set();
  for (const descriptor of index.items) {
    ensure(!descriptors.has(descriptor.id) && !filenames.has(descriptor.filename), 'INVALID_DATA', '중복된 레지스트리 항목이에요.');
    ensure(descriptor.kind !== 'harness', 'INVALID_DATA', 'UI 레지스트리에 하네스를 포함하지 않아요.');
    descriptors.set(descriptor.id, descriptor);
    filenames.add(descriptor.filename);
  }
  return { url, index, indexHash, descriptors, downloads };
}

export async function selectItems(registry, requested) {
  const selected = new Map();
  const files = new Map();
  const peers = new Map();
  async function visit(id) {
    if (selected.has(id)) return;
    const descriptor = registry.descriptors.get(id);
    ensure(descriptor && descriptor.kind !== 'harness', 'UNKNOWN_ITEM', '컴포넌트 또는 의존 항목이 없어요.', { id });
    const bytes = await readResource(new URL(descriptor.filename, registry.url).href, registry.downloads);
    ensure(hash(bytes) === descriptor.sha256, 'INTEGRITY_MISMATCH', '항목 JSON의 해시가 달라요.', { id });
    const item = parseJson(bytes.toString('utf8'), id);
    ensure(matches(item, schema.$defs.item, schema), 'INVALID_DATA', '항목 JSON의 규격이 잘못됐어요.', { id });
    ensure(item.id === id && item.kind === descriptor.kind && item.name === descriptor.name && item.description === descriptor.description && item.version === registry.index.version && item.schemaVersion === registry.index.schemaVersion, 'VERSION_MISMATCH', '목록과 상세 항목이 일치하지 않아요.', { id });
    ensure(item.kind === 'component' ? item.entry !== null : item.entry === null, 'INVALID_DATA', '공개 진입점이 올바르지 않아요.', { id });
    ensure(!item.dependencies.includes(id), 'INVALID_DATA', '항목이 자기 자신을 설치 의존성으로 지정했어요.', { id });
    for (const file of item.files) {
      safePath(file.path);
      ensure(file.path === 'LICENSE' || (/\.(ts|tsx|css|svg)$/.test(file.path) && !/\.(test|spec|stories)\./.test(file.path)), 'UNSAFE_PATH', '개발 파일은 설치하지 않아요.', { path: file.path });
      ensure(hash(file.content) === file.sha256, 'INTEGRITY_MISMATCH', '소스 파일의 해시가 달라요.', { path: file.path });
      ensure(!files.has(file.path), 'INVALID_DATA', '파일 소유자가 중복돼요.', { path: file.path });
      files.set(file.path, { ...file, owner: id });
    }
    if (item.entry) ensure(files.get(safePath(item.entry.path))?.owner === id && /^[A-Za-z_$][\w$]*$/.test(item.entry.export), 'INVALID_DATA', '공개 진입 파일이 없어요.', { id });
    for (const [name, range] of Object.entries(item.peerDependencies)) {
      ensure(/^(?:@[a-z0-9-]+\/)?[a-z0-9-]+$/.test(name) && !name.startsWith('@eli-design/'), 'INVALID_DATA', '전체 UI 패키지는 설치 의존성으로 사용할 수 없어요.');
      const ranges = peers.get(name) ?? new Set();
      ranges.add(range);
      peers.set(name, ranges);
    }
    selected.set(id, item);
    // 조립 기준이 부품을 포함하고 부품이 기준을 import할 수 있어요.
    // 검증한 항목을 먼저 기록해 서로를 참조해도 한 번씩만 받고, 모든 검증 뒤에만 파일을 써요.
    for (const dependency of item.dependencies) await visit(dependency);
  }
  for (const id of requested) {
    ensure(registry.descriptors.get(id)?.kind === 'component', 'UNKNOWN_ITEM', '공개 컴포넌트를 선택해요. list로 목록을 확인할 수 있어요.', { id });
    await visit(id);
  }
  return { selected, files, peers };
}
