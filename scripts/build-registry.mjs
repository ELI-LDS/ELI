import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const defaultSource = join(root, 'packages/ui/src');
const defaultManifest = JSON.parse(readFileSync(join(root, 'packages/ui/package.json'), 'utf8'));
const defaultCatalog = JSON.parse(readFileSync(join(root, 'packages/registry/catalog.json'), 'utf8'));
export const sha256 = content => createHash('sha256').update(content, 'utf8').digest('hex');
const kebab = value => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;

/** 개발 파일과 소비 프로젝트 밖의 경로가 설치 목록에 들어가지 않게 해요. */
export function assertSourcePath(path) {
  assert.ok(path && !path.startsWith('/') && !path.includes('\\') && !path.includes(':'), `잘못된 상대 경로: ${path}`);
  assert.ok(!path.split('/').some(part => !part || part === '.' || part === '..' || part === 'node_modules'), `잘못된 상대 경로: ${path}`);
  assert.doesNotMatch(path, /(?:^|\/)(?:__tests__|harness)(?:\/|$)|\.(?:stories|test|spec)\./, `개발 파일은 제공하지 않아요: ${path}`);
  assert.ok(/\.(?:ts|tsx|css|svg)$/.test(path) || path === 'LICENSE', `지원하지 않는 파일: ${path}`);
}

/** JS 출력 경로를 가리키는 import도 원본 TS 파일로 찾아요. 소스 내용은 바꾸지 않아요. */
function resolveLocal(sourceRoot, from, specifier) {
  const clean = specifier.split(/[?#]/)[0];
  const candidate = resolve(sourceRoot, dirname(from), clean);
  const choices = /\.js$/.test(candidate)
    ? [candidate.replace(/\.js$/, '.ts'), candidate.replace(/\.js$/, '.tsx')]
    : [candidate, `${candidate}.ts`, `${candidate}.tsx`, join(candidate, 'index.ts')];
  const found = choices.find(path => existsSync(path) && statSync(path).isFile());
  assert.ok(found, `참조 파일이 없어요: ${from} → ${specifier}`);
  const path = relative(sourceRoot, found).split('\\').join('/');
  assertSourcePath(path);
  const real = relative(realpathSync(sourceRoot), realpathSync(found)).split('\\').join('/');
  assert.ok(real !== '..' && !real.startsWith('../') && !real.startsWith('/'), `소스 밖의 참조예요: ${from} → ${specifier}`);
  return path;
}

/** import type·재수출·동적 import·CSS·이미지를 같은 파일 그래프에서 확인해요. */
function readReferences(path, content, rewrite) {
  const references = new Set();
  const edits = [];
  const addReference = (value, start, end, kind = 'module') => {
    references.add(value);
    const text = rewrite(value, kind);
    if (text !== content.slice(start, end)) edits.push({ start, end, text });
  };
  if (/\.tsx?$/.test(path)) {
    const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
    const addLiteral = (node, kind = 'module') => {
      assert.ok(node && ts.isStringLiteralLike(node), `정적 분석이 불가능한 파일 참조: ${path}`);
      addReference(node.text, node.getStart(source) + 1, node.end - 1, kind);
    };
    function visit(node) {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) addLiteral(node.moduleSpecifier);
      if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) addLiteral(node.argument.literal);
      if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) addLiteral(node.moduleReference.expression);
      if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === 'require'))) addLiteral(node.arguments[0]);
      if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'URL') addLiteral(node.arguments?.[0], 'asset');
      ts.forEachChild(node, visit);
    }
    visit(source);
    for (const ref of source.referencedFiles) addReference(ref.fileName.startsWith('.') ? ref.fileName : `./${ref.fileName}`, ref.pos, ref.end, 'path');
    for (const ref of source.typeReferenceDirectives) addReference(ref.fileName, ref.pos, ref.end, 'path');
  } else if (path.endsWith('.css')) {
    // 주석을 가릴 때 길이를 유지해야 실제 원문의 경로 위치를 정확히 바꿀 수 있어요.
    const css = content.replace(/\/\*[\s\S]*?\*\//g, match => ' '.repeat(match.length));
    for (const match of css.matchAll(/@import\s+['"]([^'"]+)['"]|url\(\s*(?:['"]([^'"]+)['"]|([^\s)]+))\s*\)/g)) {
      const value = match[1] ?? match[2] ?? match[3];
      if (!value.startsWith('data:') && !value.startsWith('#')) {
        const start = match.index + match[0].indexOf(value);
        addReference(value.startsWith('.') || /^(?:https?:|\/)/.test(value) ? value : `./${value}`, start, start + value.length, 'asset');
      }
    }
  }
  for (const edit of edits.sort((a, b) => b.start - a.start)) content = content.slice(0, edit.start) + edit.text + content.slice(edit.end);
  return { references: [...references].sort(), content };
}

/** 공개 진입점에서 선택 항목을 찾고, 실제 참조 파일만 항목별로 소유하게 해요. */
export function generateRegistry({ sourceRoot = defaultSource, manifest = defaultManifest, catalog = defaultCatalog } = {}) {
  assert.equal(catalog.schemaVersion, 1);
  assert.deepEqual(catalog.reservedKinds, ['harness']);
  assert.match(manifest.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
  const items = new Map();
  const owners = new Map();
  const publicDirectories = new Map();
  const publicEntries = new Map();
  const queue = [];
  const makeItem = (id, kind, name, description, entry = null) => {
    assert.match(id, /^(?:_[a-z0-9-]+|[a-z][a-z0-9-]*)$/);
    assert.ok(!items.has(id), `중복 항목: ${id}`);
    const item = { schemaVersion: 1, version: manifest.version, id, kind, name, description, entry, dependencies: new Set(), peerDependencies: {}, files: new Map() };
    items.set(id, item);
    return item;
  };

  for (const [group, entry] of Object.entries(manifest.exports)) {
    assert.match(entry.import, /^\.\/dist\/.+\.js$/);
    const sourceEntry = entry.import.replace(/^\.\/dist\//, '').replace(/\.js$/, '.ts');
    assertSourcePath(sourceEntry);
    const source = ts.createSourceFile(sourceEntry, readFileSync(join(sourceRoot, sourceEntry), 'utf8'), ts.ScriptTarget.Latest, true);
    for (const statement of source.statements) {
      if (!ts.isExportDeclaration(statement) || statement.isTypeOnly) continue;
      assert.ok(statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier) && statement.exportClause && ts.isNamedExports(statement.exportClause), `명시적인 named export가 필요해요: ${group}`);
      for (const exported of statement.exportClause.elements) {
        if (exported.isTypeOnly) continue;
        const name = exported.name.text;
        const path = resolveLocal(sourceRoot, sourceEntry, statement.moduleSpecifier.text);
        assert.ok(path.endsWith('.tsx'), `컴포넌트 진입 파일이 아니에요: ${name}`);
        const content = readFileSync(join(sourceRoot, path), 'utf8');
        const description = content.match(/\/\*\*\s*\n\s*\*\s*([^\n]+)/)?.[1]?.trim();
        assert.ok(description, `공개 설명이 없어요: ${name}`);
        const id = catalog.componentIds?.[name] ?? kebab(name);
        makeItem(id, 'component', name, description, { path, export: name });
        assert.ok(!publicDirectories.has(dirname(path)), `같은 폴더의 컴포넌트 소유 범위를 분리해요: ${path}`);
        publicDirectories.set(dirname(path), id);
        publicEntries.set(path, id);
        queue.push(path);
      }
    }
  }
  for (const name of Object.keys(catalog.componentIds ?? {})) {
    assert.ok([...items.values()].some(item => item.name === name), `설치 이름을 지정한 공개 컴포넌트가 없어요: ${name}`);
  }
  assert.ok(items.size > 0, '공개 컴포넌트가 없어요.');
  for (const shared of catalog.shared) {
    assertSourcePath(`${shared.directory}/index.css`);
    makeItem(shared.id, 'shared', shared.id, '여러 컴포넌트가 함께 사용하는 디자인 토큰이에요.');
  }

  // 공개 구현은 button.tsx처럼 설치 루트에 두고 스타일·타입·Hook은 button/에 모아요.
  // 원본의 그룹 폴더와 컴포넌트 폴더를 사용자 경로에 반복해서 노출하지 않아요.
  const installPath = path => {
    if (publicEntries.has(path)) return `${publicEntries.get(path)}.tsx`;
    for (const [directory, id] of publicDirectories) {
      if (path.startsWith(`${directory}/`)) return `${id}/${path.slice(directory.length + 1)}`;
    }
    return path;
  };
  const sources = new Map();
  const portablePaths = new Set();

  const ownerOf = path => {
    if (owners.has(path)) return owners.get(path);
    let id = catalog.shared.find(item => path.startsWith(`${item.directory}/`))?.id ?? publicDirectories.get(dirname(path));
    if (!id) {
      id = `_file-${kebab(path.replace(/[/.]/g, '-'))}`;
      if (!items.has(id)) makeItem(id, 'shared', path, '컴포넌트가 내부에서 참조하는 공유 파일이에요.');
      else assert.ok(items.get(id).files.has(path), `공유 파일 ID가 충돌해요: ${path}`);
    }
    owners.set(path, id);
    return id;
  };

  const seen = new Set();
  while (queue.length) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    assertSourcePath(path);
    const item = items.get(ownerOf(path));
    const content = readFileSync(join(sourceRoot, path), 'utf8');
    const target = installPath(path);
    assertSourcePath(target);
    assert.ok(!portablePaths.has(target.toLowerCase()), `설치 파일 경로가 충돌해요: ${target}`);
    portablePaths.add(target.toLowerCase());
    sources.set(target, path);
    const prepared = readReferences(path, content, (specifier, kind) => {
      if (!specifier.startsWith('.')) return specifier;
      const clean = specifier.split(/[?#]/)[0];
      const dependency = installPath(resolveLocal(sourceRoot, path, specifier));
      let rewritten = posix.relative(posix.dirname(target), dependency);
      // TypeScript 소스는 Next.js에서도 해석되는 확장자 없는 모듈 경로로 연결해요.
      if (kind === 'module') rewritten = rewritten.replace(/\.tsx?$/, '');
      if (!rewritten.startsWith('.')) rewritten = `./${rewritten}`;
      return rewritten + specifier.slice(clean.length);
    });
    item.files.set(path, { path: target, content: prepared.content, sha256: sha256(prepared.content) });
    for (const specifier of prepared.references) {
      if (!specifier.startsWith('.')) {
        const packageName = specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];
        assert.ok(manifest.peerDependencies?.[packageName], `선택 설치의 외부 의존성을 선언해요: ${path} → ${specifier}`);
        item.peerDependencies[packageName] = manifest.peerDependencies[packageName];
        continue;
      }
      const dependency = resolveLocal(sourceRoot, path, specifier);
      const dependencyOwner = ownerOf(dependency);
      if (item.id !== dependencyOwner) item.dependencies.add(dependencyOwner);
      queue.push(dependency);
    }
  }

  // 선택 설치한 소스에도 원래 라이선스를 함께 전달해요.
  const tokens = items.get('tokens');
  assert.ok(tokens?.files.size, '공통 토큰이 참조되지 않았어요.');
  const license = readFileSync(join(root, 'packages/ui/LICENSE'), 'utf8');
  tokens.files.set('LICENSE', { path: 'LICENSE', content: license, sha256: sha256(license) });

  const artifacts = new Map();
  const index = { schemaVersion: 1, version: manifest.version, license: manifest.license, reservedKinds: catalog.reservedKinds, items: [] };
  for (const item of [...items.values()].sort((a, b) => a.id.localeCompare(b.id, 'en'))) {
    assert.ok(item.files.size, `파일이 없는 항목: ${item.id}`);
    const data = { ...item, entry: item.entry ? { ...item.entry, path: installPath(item.entry.path) } : null, dependencies: [...item.dependencies].sort(), files: [...item.files.values()].sort((a, b) => a.path.localeCompare(b.path, 'en')) };
    for (const dependency of data.dependencies) assert.ok(items.has(dependency), `없는 의존 항목: ${dependency}`);
    const filename = `${item.id}.json`;
    const content = serialize(data);
    artifacts.set(filename, content);
    index.items.push({ id: item.id, kind: item.kind, name: item.name, description: item.description, filename, sha256: sha256(content) });
  }
  artifacts.set('registry.json', serialize(index));
  return { index, artifacts, sources };
}

export async function buildRegistry() {
  // 모든 참조 검증을 끝낸 뒤에만 이전 생성물을 교체해 실패 시 배포 후보를 보존해요.
  const result = generateRegistry();
  const output = join(root, '.artifacts/registry');
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  for (const [filename, content] of result.artifacts) await writeFile(join(output, filename), content);
  console.log(`레지스트리 ${result.index.version}: 공개 컴포넌트 ${result.index.items.filter(item => item.kind === 'component').length}개, 공유 항목 ${result.index.items.filter(item => item.kind === 'shared').length}개를 생성했어요.`);
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildRegistry();
