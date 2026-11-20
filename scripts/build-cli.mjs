import { chmod, copyFile, cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = join(root, 'packages/cli/dist');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(join(root, 'packages/cli/src'), destination, { recursive: true });
await copyFile(join(root, 'packages/registry/schema.json'), join(destination, 'registry.schema.json'));
await copyFile(join(root, 'LICENSE'), join(root, 'packages/cli/LICENSE'));
await chmod(join(destination, 'cli.mjs'), 0o755);
console.log('UI·하네스 콘텐츠를 포함하지 않는 eli-design 실행 파일을 만들었어요.');
