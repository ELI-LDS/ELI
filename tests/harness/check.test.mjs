import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const harness = join(import.meta.dirname, '../../packages/harness');
const hook = join(harness, 'hooks/session-start.mjs');
const postEdit = join(harness, 'hooks/post-edit.mjs');

function runHook(packageJson, designMd = false) {
  const dir = mkdtempSync(join(tmpdir(), 'eli-harness-'));
  if (designMd) writeFileSync(join(dir, 'DESIGN.md'), designMd === true ? '# 디자인 방향' : designMd);
  if (packageJson !== undefined) writeFileSync(join(dir, 'package.json'), packageJson);
  return execFileSync(process.execPath, [hook], { cwd: dir, encoding: 'utf8' });
}

test('@eli-design/ui를 쓰는 프로젝트에는 지침을 출력해요', () => {
  const output = runHook(JSON.stringify({ dependencies: { '@eli-design/ui': '0.0.0' } }));
  assert.match(output, /eli-docs/);
  assert.match(output, /\/eli-verify/);
});

test('DESIGN.md가 없을 때만 셋업을 제안해요', () => {
  const pkg = JSON.stringify({ dependencies: { '@eli-design/ui': '0.0.0' } });
  assert.match(runHook(pkg), /아직 ELI를 셋업하지 않았어요/);
  assert.doesNotMatch(runHook(pkg, true), /아직 ELI를 셋업하지 않았어요/);
});

test('@eli-design/ui를 쓰지 않으면 아무것도 출력하지 않아요', () => {
  assert.equal(runHook(JSON.stringify({ dependencies: { react: '19.3.0' } })), '');
});

test('package.json이 없거나 깨져 있어도 실패하지 않아요', () => {
  assert.equal(runHook(undefined), '');
  assert.equal(runHook('{'), '');
});

test('스킬 이름이 폴더 이름과 같고 설명이 있어요', () => {
  for (const dir of readdirSync(join(harness, 'skills'))) {
    const text = readFileSync(join(harness, 'skills', dir, 'SKILL.md'), 'utf8');
    const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';
    assert.match(frontmatter, new RegExp(`^name: ${dir}$`, 'm'), dir);
    assert.match(frontmatter, /^description: /m, dir);
  }
});

test('원격 주소 안내는 eli 스킬 한 곳에만 있어요', () => {
  for (const dir of readdirSync(join(harness, 'skills'))) {
    if (dir === 'eli') continue;
    const text = readFileSync(join(harness, 'skills', dir, 'SKILL.md'), 'utf8');
    assert.doesNotMatch(text, /https?:\/\//, dir);
  }
});

test('고친 화면 파일에 직접 쓴 색상 값이 있으면 알려요', async () => {
  const { findRawColors } = await import(postEdit);
  const hit = (file, text) => findRawColors(file, text).map(({ line }) => line);

  assert.deepEqual(hit('src/Card.tsx', 'a\n<div style={{ color: "#3182f6" }} />'), [2]);
  assert.deepEqual(hit('src/card.css', '.a { color: #FFF; }\n.b { background: rgba(0, 0, 0, 0.5); }'), [1, 2]);
  assert.deepEqual(hit('src/card.css', '.a { color: var(--color-brand); }\n#header { margin: 0; }'), []);
  assert.deepEqual(hit('src/Card.tsx', '<a href="#faq">'), []);
  assert.deepEqual(hit('src/styles/tokens.css', ':root { --color-brand: #3182f6; }'), []);
  assert.deepEqual(hit('src/util.ts', 'const c = "#3182f6";'), []);
});

test('색상 값을 찾으면 종료 코드 2와 위치를 돌려줘요', () => {
  const dir = mkdtempSync(join(tmpdir(), 'eli-harness-'));
  const file = join(dir, 'card.css');
  const run = () => spawnSync(process.execPath, [postEdit], {
    input: JSON.stringify({ tool_input: { file_path: file } }),
    encoding: 'utf8',
  });

  writeFileSync(file, '.a { color: #3182f6; }');
  const found = run();
  assert.equal(found.status, 2);
  assert.match(found.stderr, /card\.css:1/);

  writeFileSync(file, '.a { color: var(--color-brand); }');
  assert.equal(run().status, 0);
  assert.equal(spawnSync(process.execPath, [postEdit], { input: 'not json', encoding: 'utf8' }).status, 0);
});

test('도구가 보이지 않는 세션에서 쓰는 조회 스크립트가 두 응답 형식을 읽어요', async () => {
  const { parse } = await import(join(harness, 'hooks/eli-docs.mjs'));
  const message = JSON.stringify({ jsonrpc: '2.0', id: 1, result: { content: [{ type: 'text', text: '{"components":[]}' }] } });
  assert.equal(parse(message), '{"components":[]}');
  assert.equal(parse(`event: message\ndata: ${message}\n\n`), '{"components":[]}');
  assert.throws(() => parse(JSON.stringify({ jsonrpc: '2.0', id: 1, error: { code: -32602, message: 'Tool nope not found' } })), /nope/);
});

test('셋업의 두 질문은 질문 도구로 반드시 묻게 해요', () => {
  const setup = readFileSync(join(harness, 'skills/eli-setup/SKILL.md'), 'utf8');
  assert.match(setup, /AskUserQuestion/);
  assert.match(setup, /request_user_input_async/);
  assert.match(setup, /답을 받을 때까지 진행하지 않아요/);
  assert.match(runHook(JSON.stringify({ dependencies: { '@eli-design/ui': '0.0.0' } })), /AskUserQuestion/);
});

test('문서 초안이 있고 스킬이 초안을 가져다 써요', () => {
  for (const dir of ['eli-design-md', 'eli-icon', 'eli-ux-writing']) {
    const template = readFileSync(join(harness, 'skills', dir, 'template.md'), 'utf8');
    assert.match(template, /^## 정하지 않은 것$/m, dir);
    assert.match(readFileSync(join(harness, 'skills', dir, 'SKILL.md'), 'utf8'), /template\.md/, dir);
  }
});

test('eli 스킬이 가리키는 참고 문서가 있어요', () => {
  const skill = readFileSync(join(harness, 'skills/eli/SKILL.md'), 'utf8');
  const refs = [...skill.matchAll(/`(references\/[\w-]+\.md)`/g)].map((match) => match[1]);
  assert.ok(refs.length >= 3);
  for (const ref of refs) readFileSync(join(harness, 'skills/eli', ref), 'utf8');
});

test('프로젝트 안에 설치한 훅은 @eli-design/ui가 없어도 지침을 출력해요', () => {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'eli-harness-')));
  const installed = join(dir, '.claude/hooks/eli/session-start.mjs');
  cpSync(hook, installed);
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ dependencies: { react: '19.3.0' } }));
  assert.match(execFileSync(process.execPath, [installed], { cwd: dir, encoding: 'utf8' }), /\/eli-setup/);
});

test('글꼴 안내가 있고 디자인 시스템 스킬이 가리켜요', () => {
  const fonts = readFileSync(join(harness, 'skills/eli-design-system/fonts.md'), 'utf8');
  assert.match(fonts, /^# 글꼴은 Pretendard로 고정해요$/m);
  assert.doesNotMatch(fonts, /Asta Sans|Wanted Sans|SUIT/);
  assert.match(readFileSync(join(harness, 'skills/eli-design-system/SKILL.md'), 'utf8'), /fonts\.md/);
});

test('버전을 확인한 지 14일이 지나면 확인하라고 알려요', () => {
  const pkg = JSON.stringify({ dependencies: { '@eli-design/ui': '0.0.0' } });
  const daysAgo = (days) => new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
  const designMd = (date) => `## 버전\n\n| 항목 | 값 |\n| --- | --- |\n| 마지막으로 확인한 날짜 | ${date} |\n`;

  assert.match(runHook(pkg, designMd(daysAgo(30))), /30일 지났어요/);
  assert.doesNotMatch(runHook(pkg, designMd(daysAgo(3))), /지났어요|버전 기록이 없어요/);
  assert.match(runHook(pkg, designMd('확인 전')), /버전 기록이 없어요/);
  assert.match(runHook(pkg, true), /버전 기록이 없어요/);
});

test('초안이 버전을 기록하고 원본에는 버전 파일을 두지 않아요', () => {
  // VERSION은 빌드가 독립 하네스 manifest의 version으로 만들어요.
  assert.ok(!readdirSync(join(harness, 'skills/eli')).includes('VERSION'));
  const template = readFileSync(join(harness, 'skills/eli-design-md/template.md'), 'utf8');
  assert.match(template, /^\| 마지막으로 확인한 날짜 \| /m);
  assert.match(readFileSync(join(harness, 'INSTALL.md'), 'utf8'), /^## 2\. 스킬을 복사해요$/m);
});

test('설치된 패키지와 복사한 스킬의 버전이 다르면 알려요', () => {
  const setup = (packageVersion, skillVersion) => {
    const dir = mkdtempSync(join(tmpdir(), 'eli-harness-'));
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ dependencies: { '@eli-design/ui': packageVersion } }));
    writeFileSync(join(dir, 'DESIGN.md'), `| 마지막으로 확인한 날짜 | ${new Date().toISOString().slice(0, 10)} |`);
    for (const [path, text] of [
      ['node_modules/@eli-design/ui/package.json', JSON.stringify({ version: packageVersion })],
      ['.claude/skills/eli/VERSION', `${skillVersion}\n`],
    ]) {
      mkdirSync(join(dir, path, '..'), { recursive: true });
      writeFileSync(join(dir, path), text);
    }
    return execFileSync(process.execPath, [hook], { cwd: dir, encoding: 'utf8' });
  };

  assert.match(setup('0.2.0', '0.1.0'), /설치된 @eli-design\/ui는 0\.2\.0인데 프로젝트에 복사된 스킬은 0\.1\.0/);
  assert.doesNotMatch(setup('0.2.0', '0.2.0'), /복사된 스킬/);
});

test('기존 패키지에서도 UI와 하네스의 독립 버전을 구분해요', () => {
  const dir = mkdtempSync(join(tmpdir(), 'eli-harness-'));
  for (const [path, text] of [
    ['package.json', JSON.stringify({ dependencies: { '@eli-design/ui': '0.7.0' } })],
    ['node_modules/@eli-design/ui/package.json', '{"version":"0.7.0"}'],
    ['node_modules/@eli-design/ui/harness/skills/eli/VERSION', '0.1.0\n'],
    ['.claude/skills/eli/VERSION', '0.1.0\n'],
  ]) { mkdirSync(join(dir, path, '..'), { recursive: true }); writeFileSync(join(dir, path), text); }
  const run = () => execFileSync(process.execPath, [hook], { cwd: dir, encoding: 'utf8' });
  assert.doesNotMatch(run(), /복사된 스킬/);
  writeFileSync(join(dir, 'node_modules/@eli-design/ui/harness/skills/eli/VERSION'), '0.2.0\n');
  assert.match(run(), /패키지의 하네스는 0\.2\.0/);
});
