import { cp, mkdir, readdir, rm } from 'node:fs/promises';
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
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildUi();
