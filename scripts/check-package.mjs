import { execFileSync } from 'node:child_process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
export function packInfo(directory, destination) {
  const args = ['pack', '--json', '--ignore-scripts', ...(destination ? ['--pack-destination', destination] : ['--dry-run'])];
  return JSON.parse(execFileSync('npm', args, { cwd: directory, encoding: 'utf8' }))[0];
}

export async function validatePackage(directory, info) {
  const manifest = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
  assert.equal(manifest.name, '@eli-design/ui');
  assert.equal(Object.keys(manifest.dependencies ?? {}).length, 0, '실행 의존성 추가 이유와 용량 검토 후 이 기준을 갱신해요.');
  const paths = new Set(info.files.map(file => file.path));
  for (const path of paths) {
    assert.match(path, /^(dist\/|harness\/|package\.json$|README\.md$|LICENSE(?:\..*)?$)/);
    assert.doesNotMatch(path, /(\.stories\.|\.test\.|__tests__|node_modules)/);
  }
  function checkExport(value) {
    if (typeof value === 'string') assert.ok(paths.has(value.replace(/^\.\//, '')), `공개 파일이 없어요: ${value}`);
    else for (const child of Object.values(value)) checkExport(child);
  }
  checkExport(manifest.exports);
  for (const required of ['harness/INSTALL.md', 'harness/skills/eli/SKILL.md', 'harness/skills/eli/VERSION', 'harness/hooks/session-start.mjs']) {
    assert.ok(paths.has(required), `하네스 파일이 없어요: ${required}`);
  }
  assert.ok(info.size > 0 && info.unpackedSize > 0 && info.files.length > 0);
}

export async function reportSize() {
  const directory = join(root, 'packages/ui');
  const info = packInfo(directory);
  await validatePackage(directory, info);
  const report = {
    package: info.name, version: info.version, measuredAt: new Date().toISOString(),
    compressedBytes: info.size, unpackedBytes: info.unpackedSize,
    fileCount: info.files.length, files: info.files,
    scope: '패키지 자체 크기예요. React·추가 의존성·브라우저 번들 크기는 포함하지 않아요.',
  };
  const output = join(root, '.artifacts');
  await mkdir(output, { recursive: true });
  await writeFile(join(output, 'package-size.json'), JSON.stringify(report, null, 2) + '\n');
  const display = bytes => `${bytes.toLocaleString('en-US')} B (${(bytes / 1024).toFixed(2)} KiB)`;
  const summary = `${info.name}@${info.version}\n압축 다운로드 크기: ${display(info.size)}\n압축 해제 크기: ${display(info.unpackedSize)}\n포함 파일: ${info.files.length}개\n${report.scope}\n현재 개발 중인 패키지 크기예요.\n`;
  await writeFile(join(output, 'package-size.txt'), summary);
  console.log(summary);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await reportSize();
