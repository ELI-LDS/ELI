import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { packInfo, validatePackage } from '../../scripts/check-package.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = join(root, '.artifacts/package-managers');

await rm(output, { force: true, recursive: true });
await mkdir(output, { recursive: true });

const info = packInfo(join(root, 'packages/ui'), output);
await validatePackage(join(root, 'packages/ui'), info);

console.log(join(output, info.filename));
