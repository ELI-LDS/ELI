import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'packages/harness');
const { version } = JSON.parse(await readFile(join(source, 'package.json'), 'utf8'));
const files = [];
const add = (path, content) => files.push({ path, content, sha256: createHash('sha256').update(content).digest('hex') });
async function collect(path) {
  for (const entry of await readdir(join(source, path), { withFileTypes: true })) {
    const relative = `${path}/${entry.name}`;
    if (entry.isDirectory()) await collect(relative);
    else if (entry.isFile() && /\.(md|mjs)$/.test(entry.name)) add(relative, await readFile(join(source, relative), 'utf8'));
    else throw new Error(`하네스 배포에 지원하지 않는 파일: ${relative}`);
  }
}
await collect('skills');
await collect('hooks');
add('skills/eli/VERSION', `${version}\n`);
add('INSTALL.md', await readFile(join(source, 'INSTALL.md'), 'utf8'));
add('LICENSE', await readFile(join(root, 'LICENSE'), 'utf8'));
files.sort((a, b) => a.path.localeCompare(b.path));
const destination = join(root, '.artifacts/harness');
await mkdir(destination, { recursive: true });
await writeFile(join(destination, 'harness.json'), `${JSON.stringify({ schemaVersion: 1, kind: 'harness', version, files }, null, 2)}\n`);
console.log(`하네스 ${version}: ${files.length}개 파일을 UI와 분리해 생성했어요.`);
