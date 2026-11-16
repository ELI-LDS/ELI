import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
export async function buildUi(directory = join(root, 'packages/ui')) {
  await rm(join(directory, 'dist'), { recursive: true, force: true });
  execFileSync(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '-p', join(directory, 'tsconfig.build.json')], { stdio: 'inherit' });
  async function copyAssets(source, target) {
    for (const entry of await readdir(source, { withFileTypes: true })) {
      if (entry.name === '__tests__') continue;
      const input = join(source, entry.name);
      const output = join(target, entry.name);
      if (entry.isDirectory()) await copyAssets(input, output);
      else if (/\.(css|svg)$/.test(entry.name) && !/\.(test|stories)\./.test(entry.name)) {
        await mkdir(target, { recursive: true });
        await cp(input, output);
      }
    }
  }
  await copyAssets(join(directory, 'src'), join(directory, 'dist'));

  // 엘리의 스킬과 훅을 패키지에 함께 넣어요. 컴포넌트와 스킬이 항상 같은 버전으로 설치돼요.
  const harness = join(directory, 'harness');
  await rm(harness, { recursive: true, force: true });
  await cp(join(root, 'packages/harness'), harness, { recursive: true });
  const { version } = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
  await writeFile(join(harness, 'skills/eli/VERSION'), `${version}\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildUi();
