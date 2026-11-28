import assert from 'node:assert/strict';
import { chmod, copyFile, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { build } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = join(root, 'packages/cli/dist');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(join(root, 'packages/cli/src'), destination, { recursive: true });
// 버전 비교 알고리즘을 새로 만들지 않고 검증된 의존성의 필요한 함수만 동봉해요.
await build({
  configFile: false,
  envFile: false,
  publicDir: false,
  logLevel: 'error',
  build: {
    outDir: destination,
    emptyOutDir: false,
    target: 'node24',
    minify: true,
    lib: { entry: join(root, 'packages/cli/src/versions.mjs'), formats: ['es'], fileName: () => 'versions.mjs' },
  },
});
const require = createRequire(join(root, 'packages/cli/package.json'));
const semverManifestPath = require.resolve('semver/package.json');
const semver = JSON.parse(await readFile(semverManifestPath, 'utf8'));
const manifest = JSON.parse(await readFile(join(root, 'packages/cli/package.json'), 'utf8'));
assert.equal(semver.version, manifest.devDependencies.semver, '검증한 semver 버전으로 빌드해요.');
await writeFile(join(destination, 'THIRD_PARTY_LICENSES.txt'), `semver ${semver.version} — ISC\nhttps://github.com/npm/node-semver\n\n${await readFile(join(dirname(semverManifestPath), 'LICENSE'), 'utf8')}`);
await copyFile(join(root, 'packages/registry/schema.json'), join(destination, 'registry.schema.json'));
await copyFile(join(root, 'packages/harness/schema.json'), join(destination, 'harness.schema.json'));
await copyFile(join(root, 'LICENSE'), join(root, 'packages/cli/LICENSE'));
await chmod(join(destination, 'cli.mjs'), 0o755);
console.log('UI·하네스 콘텐츠를 포함하지 않는 eli-design 실행 파일을 만들었어요.');
