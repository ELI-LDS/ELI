import assert from 'node:assert/strict';
import { execFile as execFileCallback } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, delimiter, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { gzipSync } from 'node:zlib';

const execFile = promisify(execFileCallback);
const root = fileURLToPath(new URL('../../', import.meta.url));
const output = join(root, '.artifacts/cli-download-size');
const npm = process.env.ELI_NPM_BINARY ?? 'npm';
const digest = (bytes, algorithm = 'sha256', format = 'hex') => createHash(algorithm).update(bytes).digest(format);
const json = value => `${JSON.stringify(value, null, 2)}\n`;
const manifest = JSON.parse(await readFile(join(root, 'packages/cli/package.json'), 'utf8'));
const scenarios = [
  { id: 'button', name: 'Button', commands: [['add', 'button']] },
  { id: 'modal', name: 'Modal (Button·Dim 포함)', commands: [['add', 'modal']] },
  { id: 'sequential', name: 'Button → Modal → Select', commands: [['add', 'button'], ['add', 'modal'], ['add', 'select']] },
  { id: 'all', name: '전체 컴포넌트', commands: [['add', '--all']] },
  { id: 'harness', name: '하네스 (Claude Code·Codex)', commands: [['harness', '--agent', 'all']], harness: true, onlyHarness: true },
  { id: 'button-harness', name: 'Button + 하네스', commands: [['add', 'button'], ['harness', '--agent', 'all']], harness: true },
];

const baseEnv = { ...process.env, PATH: [dirname(process.execPath), process.env.PATH].join(delimiter), CI: '1' };
assert.equal((await execFile(npm, ['--version'], { env: baseEnv })).stdout.trim(), '11.19.0');
assert.deepEqual(Object.keys(manifest.dependencies), ['semver'], '실행 의존성이 바뀌면 측정 그래프도 함께 갱신해요.');
const peer = JSON.parse(await readFile(join(root, 'node_modules/react/package.json'), 'utf8'));
const registryDirectory = join(root, '.artifacts/registry');
const index = JSON.parse(await readFile(join(registryDirectory, 'registry.json'), 'utf8'));

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const packed = JSON.parse((await execFile(npm, ['pack', '--ignore-scripts', '--json', '--pack-destination', output], { cwd: join(root, 'packages/cli'), env: baseEnv })).stdout)[0];
assert.ok(packed.files.every(file => ['package.json', 'README.md', 'LICENSE'].includes(file.path) || file.path.startsWith('dist/')));
assert.ok(!packed.files.some(file => /^(harness|skills|hooks)\/|\.tsx|tokens\//.test(file.path)));
const toolTarball = await readFile(join(output, packed.filename));
const toolHash = digest(toolTarball);

/** 실제 npm 메타데이터를 고정하고 tarball 무결성을 확인한 뒤 측정 서버에 전달해요. */
async function fetchJson(url, headers = {}) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
  assert.ok(response.ok, `${url}: ${response.status}`);
  return response.json();
}
const dependencyVersion = manifest.dependencies.semver;
assert.match(dependencyVersion, /^\d+\.\d+\.\d+$/);
const dependencyMetadata = await fetchJson('https://registry.npmjs.org/semver', { accept: 'application/vnd.npm.install-v1+json' });
const dependency = dependencyMetadata.versions[dependencyVersion];
assert.ok(dependency);
assert.deepEqual(Object.keys(dependency.dependencies ?? {}), [], '전이 의존성이 생기면 누락 없이 측정해야 해요.');
assert.deepEqual(Object.keys(dependency.optionalDependencies ?? {}), []);
const metadataSnapshot = Buffer.from(json(dependencyMetadata));
await writeFile(join(output, 'semver-metadata.json'), metadataSnapshot);
const archiveUrl = new URL(dependency.dist.tarball);
assert.equal(archiveUrl.origin, 'https://registry.npmjs.org');
assert.equal(archiveUrl.pathname, `/semver/-/semver-${dependencyVersion}.tgz`);
const archiveResponse = await fetch(archiveUrl, { signal: AbortSignal.timeout(30_000) });
assert.ok(archiveResponse.ok);
const dependencyTarball = Buffer.from(await archiveResponse.arrayBuffer());
assert.equal(`sha512-${digest(dependencyTarball, 'sha512', 'base64')}`, dependency.dist.integrity);
await writeFile(join(output, `semver-${dependencyVersion}.tgz`), dependencyTarball);

const registryFiles = new Map();
const harnessBytes = await readFile(join(root, '.artifacts/harness/harness.json'));
for (const filename of await readdir(registryDirectory)) {
  if (filename.endsWith('.json')) registryFiles.set(filename, await readFile(join(registryDirectory, filename)));
}

const requests = [];
const unexpected = [];
let origin;
const payloads = new Map();
const server = createServer((request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname;
  const payload = payloads.get(path);
  if (!payload || request.method !== 'GET') {
    unexpected.push({ method: request.method, path });
    response.writeHead(404).end();
    return;
  }
  const { bytes, category, profile, isJson } = payload;
  const compress = isJson && profile === 'gzip' && /\bgzip\b/.test(request.headers['accept-encoding'] ?? '');
  const encoded = compress ? gzipSync(bytes, { level: 9 }) : bytes;
  const etag = `"${digest(encoded)}"`;
  const cached = request.headers['if-none-match'] === etag;
  const body = cached ? Buffer.alloc(0) : encoded;
  const headers = {
    'content-type': isJson ? 'application/json' : 'application/octet-stream',
    'cache-control': category === 'metadata' ? 'public, max-age=0, must-revalidate' : 'public, max-age=31536000, immutable', etag,
    ...(isJson ? { vary: 'accept-encoding' } : {}),
    ...(compress && !cached ? { 'content-encoding': 'gzip' } : {}),
    ...(!cached ? { 'content-length': String(body.length) } : {}),
  };
  requests.push({ path, category, status: cached ? 304 : 200, responseBodyBytes: body.length, decodedBodyBytes: cached ? 0 : bytes.length, encoding: compress ? 'gzip' : 'identity' });
  response.writeHead(cached ? 304 : 200, headers).end(body);
});

function addPayload(path, bytes, category, profile, isJson = false) {
  payloads.set(path, { bytes, category, profile, isJson });
}

/** 캐시 사용 여부는 서버의 실제 응답으로 확인하고 추출한 소스는 중복 합산하지 않아요. */
function summarize(log, results) {
  const categories = Object.fromEntries(['tool', 'dependencies', 'metadata', 'registry', 'harness'].map(category => [category, log.filter(entry => entry.category === category).reduce((sum, entry) => sum + entry.responseBodyBytes, 0)]));
  const created = results.flatMap(result => result.files ?? []).filter(file => file.action === 'add' && (file.owner || /^\.(claude|agents|codex)\/(skills\/|hooks\/eli\/)/.test(file.path)));
  const reused = results.flatMap(result => result.files ?? []).filter(file => file.action === 'reuse');
  return {
    responseBodyBytes: Object.values(categories).reduce((sum, bytes) => sum + bytes, 0), categories,
    decodedRegistryBytes: log.filter(entry => entry.category === 'registry').reduce((sum, entry) => sum + entry.decodedBodyBytes, 0),
    requests: log.length, createdFiles: new Set(created.map(file => file.path)).size, reusedFileReferences: reused.length,
  };
}

const measurements = [];
let work;
try {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  for (const profile of ['identity', 'gzip']) {
    const toolUrl = `${origin}/${profile}/npm/eli-design-${toolHash}.tgz`;
    const dependencyUrl = `${origin}/${profile}/npm/semver-${dependencyVersion}.tgz`;
    addPayload(`/${profile}/npm/eli-design-${toolHash}.tgz`, toolTarball, 'tool', profile);
    addPayload(`/${profile}/npm/semver-${dependencyVersion}.tgz`, dependencyTarball, 'dependencies', profile);
    const toolMetadata = {
      name: manifest.name, 'dist-tags': { latest: manifest.version },
      versions: { [manifest.version]: { ...manifest, _id: `${manifest.name}@${manifest.version}`, dist: { tarball: toolUrl, integrity: `sha512-${digest(toolTarball, 'sha512', 'base64')}` } } },
    };
    const proxiedDependency = structuredClone(dependencyMetadata);
    proxiedDependency.versions[dependencyVersion].dist.tarball = dependencyUrl;
    addPayload(`/${profile}/npm/eli-design`, Buffer.from(json(toolMetadata)), 'metadata', profile, true);
    addPayload(`/${profile}/npm/semver`, Buffer.from(json(proxiedDependency)), 'metadata', profile, true);
    for (const [filename, bytes] of registryFiles) addPayload(`/${profile}/ui/${filename}`, bytes, 'registry', profile, true);
    addPayload(`/${profile}/harness/harness.json`, harnessBytes, 'harness', profile, true);

    for (const scenario of scenarios) {
      work = await mkdtemp(join(tmpdir(), 'eli-download-size-'));
      const app = join(work, 'app');
      await mkdir(join(app, 'node_modules'), { recursive: true });
      await mkdir(join(app, 'src'));
      // React가 이미 준비된 앱을 조건으로 하고 이 사전 준비 다운로드는 합산하지 않아요.
      if (!scenario.onlyHarness) await cp(await realpath(join(root, 'node_modules/react')), join(app, 'node_modules/react'), { recursive: true });
      const appManifest = json({ private: true, type: 'module', packageManager: 'npm@11.19.0', dependencies: scenario.onlyHarness ? {} : { react: peer.version } });
      await writeFile(join(app, 'package.json'), appManifest);
      const env = {
        ...baseEnv, npm_config_registry: `${origin}/${profile}/npm/`, npm_config_cache: join(work, 'npm-cache'),
        npm_config_audit: 'false', npm_config_fund: 'false', npm_config_ignore_scripts: 'true',
      };
      const run = async args => {
        const result = await execFile(npm, ['exec', '--yes', '--package', `eli-design@${manifest.version}`, '--', 'eli-design', ...args, '--cwd', app, '--json'], { cwd: app, env, timeout: 60_000, maxBuffer: 8 * 1024 * 1024 });
        const parsed = JSON.parse(result.stdout);
        assert.equal(parsed.ok, true);
        assert.equal(await readFile(join(app, 'package.json'), 'utf8'), appManifest);
        assert.ok(!(await readdir(app)).some(file => /^(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?)$/.test(file)));
        return parsed;
      };

      const coldStart = requests.length;
      const commands = scenario.commands.map(args => args[0] === 'harness' ? [...args, '--registry', `${origin}/${profile}/harness/harness.json`] : args);
      const coldResults = scenario.onlyHarness ? [] : [await run(['init', '--registry', `${origin}/${profile}/ui/registry.json`])];
      for (const args of commands) coldResults.push(await run(args));
      const coldLog = requests.slice(coldStart);
      const record = scenario.onlyHarness ? { files: [], resolved: [], entries: [] } : JSON.parse(await readFile(join(app, 'eli.lock.json'), 'utf8'));
      const files = [...record.files, ...(scenario.harness ? JSON.parse(await readFile(join(app, 'eli.harness.json'), 'utf8')).files : [])];
      let sourceBytes = 0;
      for (const file of files) {
        const content = await readFile(join(app, file.path));
        assert.equal(digest(content), file.sha256);
        sourceBytes += content.length;
      }
      assert.equal(record.files.filter(file => file.path.endsWith('/tokens/colors.css')).length, scenario.onlyHarness ? 0 : 1);
      const warmStart = requests.length;
      const warmResults = [];
      for (const args of commands) warmResults.push(await run(args));
      const warmLog = requests.slice(warmStart);
      const cold = summarize(coldLog, coldResults);
      const warm = summarize(warmLog, warmResults);
      assert.equal(cold.categories.tool, toolTarball.length, '콜드 실행은 도구 tarball을 한 번 받아야 해요.');
      assert.equal(cold.categories.dependencies, dependencyTarball.length, '도구의 실제 실행 의존성을 빠짐없이 측정해요.');
      assert.equal(warm.categories.tool + warm.categories.dependencies, 0, '재실행은 npm tarball 캐시를 재사용해야 해요.');
      assert.equal(warm.createdFiles, 0);
      assert.ok(warm.categories.registry + warm.categories.harness > 0, '현재 CLI에는 배포 JSON의 영구 HTTP 캐시가 없어요.');
      if (scenario.onlyHarness) assert.equal(cold.categories.registry, 0, '하네스만 요청하면 UI는 받지 않아요.');
      if (!scenario.harness) assert.equal(cold.categories.harness, 0, 'UI만 요청하면 하네스는 받지 않아요.');
      if (scenario.id === 'button') assert.ok(coldLog.every(entry => !/\/(?:modal|icon-button)\.json$/.test(entry.path)));
      if (scenario.id === 'all') assert.equal(record.entries.length, index.items.filter(item => item.kind === 'component').length);
      for (const result of [...coldResults, ...warmResults]) {
        const delivered = result.downloads.reduce((sum, entry) => sum + entry.bytes, 0);
        assert.ok(delivered > 0);
      }
      assert.equal([...coldResults, ...warmResults].reduce((sum, result) => sum + result.downloads.reduce((size, item) => size + item.bytes, 0), 0), [...coldLog, ...warmLog].filter(entry => ['registry', 'harness'].includes(entry.category)).reduce((sum, entry) => sum + entry.decodedBodyBytes, 0));
      measurements.push({ scenario: scenario.id, name: scenario.name, profile, commands, cold, warm, installedSourceBytes: sourceBytes, installedSourceFiles: files.length, resolvedItems: record.resolved, existingReact: scenario.onlyHarness ? null : peer.version, appDependencyDownloadBytes: 0, coldLog, warmLog });
      console.log(`${profile} / ${scenario.name}: 콜드 ${cold.responseBodyBytes.toLocaleString()} B, 재실행 ${warm.responseBodyBytes.toLocaleString()} B`);
      await rm(work, { recursive: true, force: true });
      work = null;
    }
  }
  assert.deepEqual(unexpected, [], '측정하지 않은 외부 패키지 요청이 있어요.');
} finally {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  if (work) await rm(work, { recursive: true, force: true });
}

const report = {
  measuredAt: new Date().toISOString(), environment: { node: process.versions.node, npm: '11.19.0', platform: process.platform, arch: process.arch },
  tool: { name: manifest.name, version: manifest.version, sha256: toolHash, compressedBytes: toolTarball.length, unpackedBytes: packed.unpackedSize, files: packed.files.length },
  runtimeDependencies: [{ name: 'semver', version: dependencyVersion, integrity: dependency.dist.integrity, compressedBytes: dependencyTarball.length }],
  contentVersion: index.version, registrySha256: digest(registryFiles.get('registry.json')), existingReact: peer.version,
  harness: { version: JSON.parse(harnessBytes).version, sha256: digest(harnessBytes), bytes: harnessBytes.length },
  scope: '미게시 후보를 격리한 로컬 HTTP 레지스트리에서 실제 npm exec로 실행해 측정한 응답 본문 바이트예요. 공개 npm/CDN의 실측값이 아니에요.',
  excluded: ['HTTP 헤더·TLS·TCP 전송량', 'Node.js·npm 도구 설치', '이미 설치된 React', '실제 npm 게시 후 메타데이터와 배포 태그 조회 차이', 'GitHub Release 탐색 API·리디렉션', '다른 패키지 매니저의 캐시 정책', '브라우저 번들 크기'],
  cache: '각 콜드 시나리오는 빈 npm 캐시와 새 앱에서 init 후 추가를 실행해요. 재실행은 같은 캐시·앱에서 추가 명령만 반복해요. npm 메타데이터는 max-age=0·ETag 재검증, tarball과 UI 데이터는 immutable이며 JSON 압축은 identity 또는 gzip level 9예요.',
  metadata: 'CLI 메타데이터는 로컬 후보용 fixture이고 semver는 npm install-v1 스냅샷에서 대상 tarball URL만 측정 서버로 바꿔요. 준비 중 내려받은 데이터는 실행 전송량에 중복 합산하지 않아요.',
  dependencyMetadataSha256: digest(metadataSnapshot),
  measurements,
};
await writeFile(join(output, 'report.json'), json(report));
const lines = [
  '# CLI 다운로드량 측정', '', report.scope, '',
  `- 도구: ${manifest.name}@${manifest.version}, SHA-256 ${toolHash}`,
  `- 콘텐츠: UI ${index.version}, 하네스 ${JSON.parse(harnessBytes).version}. UI는 React ${peer.version}이 이미 설치된 앱, 하네스 단독은 React 없는 앱이에요.`,
  '- 아래 합계는 도구 tarball + 실행 의존성 tarball + npm 메타데이터 + 선택한 UI·하네스 JSON 응답 본문이에요. 추출한 파일은 다시 더하지 않아요.',
  '- 콜드는 init을 포함하고, 재실행은 추가 명령만 반복해요. 공개 전송량과 미측정 범위는 report.json에 기록해요.', '',
  '| 압축 | 시나리오 | 콜드 응답 본문 | 재실행 응답 본문 | 설치 소스 | 파일 수 |',
  '| --- | --- | ---: | ---: | ---: | ---: |',
  ...measurements.map(item => `| ${item.profile} | ${item.name} | ${item.cold.responseBodyBytes.toLocaleString()} B | ${item.warm.responseBodyBytes.toLocaleString()} B | ${item.installedSourceBytes.toLocaleString()} B | ${item.installedSourceFiles} |`),
  '', '## 콜드 실행의 범주별 전송량', '',
  '| 압축 | 시나리오 | 도구 | 실행 의존성 | npm 메타데이터 | UI JSON | 하네스 JSON |',
  '| --- | --- | ---: | ---: | ---: | ---: | ---: |',
  ...measurements.map(item => `| ${item.profile} | ${item.name} | ${['tool', 'dependencies', 'metadata', 'registry', 'harness'].map(category => `${item.cold.categories[category].toLocaleString()} B`).join(' | ')} |`),
  '', '재실행에는 새 소스 파일이 추가되지 않아요. npm tarball은 캐시를 재사용하지만 현재 CLI는 UI·하네스 JSON을 다시 받아요.',
  '',
];
await writeFile(join(output, 'report.md'), lines.join('\n'));
console.log('측정 결과: .artifacts/cli-download-size/report.json, report.md');
