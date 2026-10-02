import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const expected = manifest.engines.node;
if (process.versions.node !== expected) {
  throw new Error(`Node.js ${expected}가 필요해요. 현재 버전은 ${process.versions.node}예요. .node-version을 확인해요.`);
}
const agent = process.env.npm_config_user_agent ?? '';
if (!agent.startsWith(`pnpm/${manifest.engines.pnpm} `)) {
  throw new Error(`pnpm ${manifest.engines.pnpm}로 설치해요. README의 환경 준비 절차를 확인해요.`);
}
