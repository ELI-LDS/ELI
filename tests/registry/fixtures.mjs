import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const hash = text => createHash('sha256').update(text, 'utf8').digest('hex');

/** CLI 없이도 배포 JSON만 읽어 소비 파일을 복원하는 검증용 클라이언트예요. */
export async function selectFiles(directory, requested) {
  const index = JSON.parse(await readFile(join(directory, 'registry.json'), 'utf8'));
  const descriptors = new Map(index.items.map(item => [item.id, item]));
  const selected = new Map();
  const files = new Map();
  async function visit(id) {
    if (selected.has(id)) return;
    const descriptor = descriptors.get(id);
    assert.ok(descriptor, `없는 항목: ${id}`);
    assert.match(descriptor.filename, /^[_a-z0-9-]+\.json$/);
    const content = await readFile(join(directory, descriptor.filename), 'utf8');
    assert.equal(hash(content), descriptor.sha256, `항목 해시가 달라요: ${id}`);
    const item = JSON.parse(content);
    assert.equal(item.id, id);
    assert.equal(item.version, index.version);
    assert.equal(item.schemaVersion, index.schemaVersion);
    selected.set(id, item);
    for (const dependency of item.dependencies) await visit(dependency);
    for (const file of item.files) {
      assert.ok(!file.path.startsWith('/') && !file.path.includes('\\') && file.path.split('/').every(part => part && part !== '.' && part !== '..'));
      const content = file.encoding === 'base64' ? Buffer.from(file.content, 'base64') : file.content;
      assert.equal(hash(content), file.sha256);
      if (files.has(file.path)) assert.deepEqual(files.get(file.path), content, `공유 파일이 충돌해요: ${file.path}`);
      files.set(file.path, content);
    }
  }
  for (const id of requested) await visit(id);
  return { index, selected, files };
}

export async function materialize(directory, destination, requested) {
  const selection = await selectFiles(directory, requested);
  for (const [path, content] of selection.files) {
    const target = join(destination, path);
    await mkdir(join(target, '..'), { recursive: true });
    await writeFile(target, content);
  }
  return selection;
}
