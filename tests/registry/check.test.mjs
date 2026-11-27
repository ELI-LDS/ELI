import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { generateRegistry, assertSourcePath, sha256 } from '../../scripts/build-registry.mjs';
import { selectFiles } from './fixtures.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const directory = join(root, '.artifacts/registry');
const schema = JSON.parse(await readFile(join(root, 'packages/registry/schema.json'), 'utf8'));

// 의존성 추가 없이 이번 공개 JSON Schema에서 사용하는 제약을 검증해요.
function matches(value, rule) {
  if (rule.$ref) return matches(value, schema.$defs[rule.$ref.split('/').at(-1)]);
  if (rule.oneOf) return rule.oneOf.filter(option => matches(value, option)).length === 1;
  if ('const' in rule && JSON.stringify(value) !== JSON.stringify(rule.const)) return false;
  if (rule.enum && !rule.enum.includes(value)) return false;
  if (rule.type === 'null' && value !== null) return false;
  if (rule.type === 'string' && (typeof value !== 'string' || value.length < (rule.minLength ?? 0) || (rule.pattern && !new RegExp(rule.pattern).test(value)))) return false;
  if (rule.type === 'array') {
    if (!Array.isArray(value) || value.length < (rule.minItems ?? 0)) return false;
    if (rule.uniqueItems && new Set(value.map(entry => JSON.stringify(entry))).size !== value.length) return false;
    if (rule.items && !value.every(entry => matches(entry, rule.items))) return false;
  }
  if (rule.type === 'object') {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
    if (rule.required?.some(key => !(key in value))) return false;
    for (const [key, child] of Object.entries(value)) {
      if (rule.properties?.[key]) { if (!matches(child, rule.properties[key])) return false; }
      else if (rule.additionalProperties === false) return false;
      else if (typeof rule.additionalProperties === 'object' && !matches(child, rule.additionalProperties)) return false;
    }
  }
  return true;
}

test('공개 항목과 공유 파일 전체가 규격·버전·해시를 지켜요', async () => {
  const index = JSON.parse(await readFile(join(directory, 'registry.json'), 'utf8'));
  assert.ok(matches(index, schema));
  assert.ok(index.items.filter(item => item.kind === 'component').length > 0);
  assert.ok(!index.items.some(item => item.kind === 'harness'));
  assert.deepEqual(index.reservedKinds, ['harness']);
  const all = await selectFiles(directory, index.items.map(item => item.id));
  const { sources } = generateRegistry();
  const owned = new Set();
  for (const item of all.selected.values()) {
    assert.ok(matches(item, schema), item.id);
    for (const file of item.files) {
      assertSourcePath(file.path);
      assert.ok(!owned.has(file.path), `파일 소유자가 둘이에요: ${file.path}`);
      owned.add(file.path);
      if (file.path !== 'LICENSE') {
        const original = await readFile(join(root, 'packages/ui/src', sources.get(file.path)), 'utf8');
        if (file.path.endsWith('.svg')) assert.equal(file.content, original);
        // 경로 보정이 주석과 클라이언트 경계를 훼손하면 안 돼요.
        for (const comment of original.matchAll(/\/\*[\s\S]*?\*\//g)) assert.ok(file.content.includes(comment[0]));
        if (original.startsWith("'use client';")) assert.ok(file.content.startsWith("'use client';"));
      }
    }
    if (item.entry) {
      assert.equal(item.entry.path, `${item.id}.tsx`);
      assert.ok(all.files.has(item.entry.path));
    }
  }
  assert.ok(!matches({ ...index, version: 'latest' }, schema));
  assert.ok(!matches({ ...all.selected.get('button'), files: [] }, schema));
});

test('Button만 선택하면 형제 컴포넌트와 하네스가 없어요', async () => {
  const { selected, files } = await selectFiles(directory, ['button']);
  assert.ok(selected.has('button') && selected.has('tokens'));
  assert.ok(files.has('icon/PlusIcon.tsx'));
  assert.match(files.get('button.tsx'), /^'use client';/);
  assert.match(files.get('button.tsx'), /@example 빠른 사용/);
  assert.match(files.get('button.tsx'), /import '\.\/button\/Button.css'/);
  assert.match(files.get('button/Button.css'), /@import '\.\.\/tokens\/index.css'/);
  assert.ok(![...files.keys()].some(path => path.includes('button/Button/')));
  assert.ok(![...files.keys()].some(path => /IconButton|modal\/|harness|stories|node_modules/.test(path)));
});

test('조합 컴포넌트와 타입·CSS·SVG 의존 파일을 함께 제공해요', async () => {
  const modal = await selectFiles(directory, ['modal']);
  assert.ok(modal.selected.has('button'));
  assert.ok(modal.files.has('dim/Dim/Dim.tsx'));
  const select = await selectFiles(directory, ['select']);
  assert.ok(select.selected.has('menu-item'));
  const fab = await selectFiles(directory, ['fab-menu']);
  assert.ok(fab.selected.has('fab') && fab.selected.has('fab-menu-segment'));
  const loading = await selectFiles(directory, ['loading-indicator']);
  assert.ok(loading.files.has('loading/loading.types.ts'));
  assert.ok(loading.files.has('loading-indicator/indeterminate-track.svg'));
  const combined = await selectFiles(directory, ['button', 'modal', 'select']);
  assert.equal([...combined.selected.keys()].filter(id => id === 'tokens').length, 1);
});

test('같은 원본의 생성 결과는 바이트와 해시가 같아요', () => {
  assert.deepEqual(generateRegistry().artifacts, generateRegistry().artifacts);
});

test('조립 기준 하나로 부품을 모두 받고 관계없는 컴포넌트는 받지 않아요', async () => {
  for (const [id, parts] of [
    ['fab', ['fab', 'fab-menu', 'fab-menu-segment']],
    ['navigation-drawer', ['navigation-drawer', 'navigation-drawer-category', 'navigation-drawer-menu', 'navigation-drawer-item']],
  ]) {
    const { selected, files } = await selectFiles(directory, [id]);
    assert.deepEqual([...selected.values()].filter(item => item.kind === 'component').map(item => item.id).sort(), [...parts].sort());
    for (const part of parts) assert.ok(files.has(`${part}.tsx`), part);
    assert.equal([...selected.keys()].filter(id => id === 'tokens').length, 1);
    assert.ok(![...selected.keys()].some(id => ['button', 'modal', 'harness'].includes(id)));
  }
});

test('없는 항목·자기 자신·중복·비공개 부품을 조립 관계로 등록하지 못해요', async () => {
  const catalog = JSON.parse(await readFile(join(root, 'packages/registry/catalog.json'), 'utf8'));
  for (const compositions of [
    { missing: ['fab'] }, { fab: ['fab'] }, { fab: ['fab-menu', 'fab-menu'] }, { fab: ['tokens'] },
  ]) assert.throws(() => generateRegistry({ catalog: { ...catalog, compositions } }), /조립/);
});

test('소스 배치를 줄여도 타입 참조·재수출·URL·CSS 연결과 주석을 보존해요', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'eli-registry-paths-'));
  const sourceRoot = join(fixture, 'src');
  await cp(join(root, 'packages/ui/src'), sourceRoot, { recursive: true });
  const component = join(sourceRoot, 'button/Button');
  const file = join(component, 'Button.tsx');
  const original = await readFile(file, 'utf8');
  await writeFile(file, `/// <reference path="./ambient.d.ts" />\n${original}\nexport type { Extra } from './extra.js';\nconst asset = new URL('./asset.svg?raw', import.meta.url);\n`);
  await writeFile(join(component, 'ambient.d.ts'), 'declare const fixtureValue: string;\n');
  await writeFile(join(component, 'extra.ts'), 'export type Extra = string;\n');
  await writeFile(join(component, 'asset.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  const cssFile = join(component, 'Button.css');
  await writeFile(cssFile, `${await readFile(cssFile, 'utf8')}\n/* url('./missing.svg')는 주석이라 참조하지 않아요. */\n.fixture { background: url('./asset.svg?v=1#icon'); }\n`);
  const item = JSON.parse(generateRegistry({ sourceRoot }).artifacts.get('button.json'));
  const main = item.files.find(file => file.path === 'button.tsx').content;
  assert.ok(main.includes('path="./button/ambient.d.ts"'));
  assert.ok(main.includes("from './button/extra'"));
  assert.ok(main.includes("new URL('./button/asset.svg?raw'"));
  const css = item.files.find(file => file.path === 'button/Button.css').content;
  assert.ok(css.includes("@import '../tokens/index.css'"));
  assert.ok(css.includes("url('./asset.svg?v=1#icon')"));
  assert.ok(css.includes("/* url('./missing.svg')는 주석이라 참조하지 않아요. */"));
});

test('설치 위치로 변환한 두 원본 파일이 충돌하면 생성하지 않아요', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'eli-registry-collision-'));
  const sourceRoot = join(fixture, 'src');
  await cp(join(root, 'packages/ui/src'), sourceRoot, { recursive: true });
  const file = join(sourceRoot, 'button/Button/Button.tsx');
  await writeFile(file, `${await readFile(file, 'utf8')}\nimport '../Button.types.js';\n`);
  await writeFile(join(sourceRoot, 'button/Button.types.ts'), 'export {};\n');
  assert.throws(() => generateRegistry({ sourceRoot }), /설치 파일 경로가 충돌/);
});

test('누락 참조·미선언 외부 의존성·개발 파일을 배포 후보로 만들지 않아요', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'eli-registry-invalid-'));
  const sourceRoot = join(fixture, 'src');
  await cp(join(root, 'packages/ui/src'), sourceRoot, { recursive: true });
  const file = join(sourceRoot, 'button/Button/Button.tsx');
  const original = await readFile(file, 'utf8');
  for (const [statement, expected] of [
    ["import './missing.js';", /참조 파일이 없어요/],
    ["import 'missing-runtime';", /외부 의존성을 선언/],
    ["import './Button.test.tsx';", /개발 파일/],
  ]) {
    await writeFile(file, `${statement}\n${original}`);
    // 개발 파일은 실제 존재해도 배포에서 제외해야 해요.
    await writeFile(join(sourceRoot, 'button/Button/Button.test.tsx'), 'export {};');
    assert.throws(() => generateRegistry({ sourceRoot }), expected);
  }
  for (const path of ['../outside.ts', '/absolute.ts', 'a/../../escape.ts', 'a\\b.ts', 'harness/file.ts']) assert.throws(() => assertSourcePath(path));
});

test('소비자는 상세 JSON의 변경과 버전 혼합을 감지할 수 있어요', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'eli-registry-corrupt-'));
  await cp(directory, fixture, { recursive: true });
  const indexPath = join(fixture, 'registry.json');
  const index = JSON.parse(await readFile(indexPath, 'utf8'));
  const descriptor = index.items.find(item => item.id === 'button');
  const itemPath = join(fixture, descriptor.filename);
  const item = JSON.parse(await readFile(itemPath, 'utf8'));
  item.version = '999.0.0';
  const text = JSON.stringify(item);
  await writeFile(itemPath, text);
  await assert.rejects(selectFiles(fixture, ['button']), /해시가 달라요/);
  descriptor.sha256 = sha256(text);
  await writeFile(indexPath, JSON.stringify(index));
  await assert.rejects(selectFiles(fixture, ['button']), /999\.0\.0/);
});
