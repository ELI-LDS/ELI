import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const check = fileURLToPath(new URL('./check.mjs', import.meta.url));
const requestedTargets = process.argv
  .filter(argument => argument.startsWith('--target='))
  .map(argument => argument.split('=')[1]);
const targets = requestedTargets.length > 0
  ? requestedTargets
  : ['chromium', 'firefox', 'webkit', 'android-chromium', 'ios-webkit'];

for (const target of targets) {
  execFileSync(process.execPath, [check, `--target=${target}`], { stdio: 'inherit' });
}

console.log(`${targets.join(', ')} 브라우저 호환성 행렬을 통과했어요.`);
