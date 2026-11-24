// 레지스트리 JSON(목록·항목)에서 문서 데이터를 만들어 content/generated/data.ts에 써요.
// 컴포넌트 설명·섹션은 진입 파일의 JSDoc, props는 타입 선언, 토큰은 tokens 항목의 CSS에서 가져와요.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { generateRegistry } from '../../../scripts/build-registry.mjs';
import { GUIDE_TOPICS, JSDOC_HEADINGS, TOKEN_FILES } from '../content/schema.ts';

const docs = fileURLToPath(new URL('../', import.meta.url));
const SEMVER = /^\d+\.\d+\.\d+$/;
const oneLine = text => text.replace(/\s+/g, ' ').trim();

/** 진입 파일의 첫 JSDoc을 summary·examples와 `###` 제목별 섹션으로 나눠요. */
export function parseSections(name, source) {
  const block = source.match(/\/\*\*([\s\S]*?)\*\//)?.[1];
  assert.ok(block, `JSDoc이 없어요: ${name}`);
  const sections = {};
  const add = (key, text) => {
    if (text.trim()) sections[key] = sections[key] ? `${sections[key]}\n\n${text.trim()}` : text.trim();
  };
  let key = 'summary';
  let lines = [];
  for (const raw of block.split('\n')) {
    const line = raw.replace(/^\s*\* ?/, '').trimEnd();
    const example = line.match(/^@example\s*(.*)$/);
    const heading = line.match(/^###\s+(.+)$/);
    if (!example && !heading) {
      lines.push(line);
      continue;
    }
    add(key, lines.join('\n'));
    if (heading) assert.ok(JSDOC_HEADINGS[heading[1]], `허용하지 않는 JSDoc 제목이에요: ${name} → ${heading[1]}`);
    key = example ? 'examples' : JSDOC_HEADINGS[heading[1]];
    lines = example?.[1] ? [`**${example[1]}**`] : [];
  }
  add(key, lines.join('\n'));
  assert.ok(sections.summary, `설명이 없어요: ${name}`);
  return sections;
}

/** `{Name}Props`와 같은 파일 묶음의 로컬 타입을 따라가 직접 정의한 props만 모아요. */
export function parseProps(name, files) {
  const declarations = new Map();
  for (const file of files) {
    if (!/\.tsx?$/.test(file.path)) continue;
    const source = ts.createSourceFile(file.path, file.content, ts.ScriptTarget.Latest, true);
    for (const statement of source.statements) {
      if ((ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) && !declarations.has(statement.name.text)) declarations.set(statement.name.text, statement);
    }
  }
  const root = declarations.get(`${name}Props`);
  assert.ok(root, `props 타입이 없어요: ${name}Props`);

  // 유니언 별칭과 작은 객체 타입은 풀어 써서 에이전트가 타입 파일을 다시 열지 않게 해요.
  const expand = (text, seen = []) =>
    oneLine(text)
      .replace(/^\| /, '')
      .replace(/(?<![\w.'"`])[A-Z]\w*(?![\w'"`])/g, (id, offset, whole) => {
        const node = declarations.get(id);
        if (!node || seen.includes(id) || node.typeParameters) return id;
        const next = [...seen, id];
        if (ts.isTypeAliasDeclaration(node)) {
          const value = expand(node.type.getText(), next);
          return value.includes(' | ') && whole[offset + id.length] === '[' ? `(${value})` : value;
        }
        if (node.heritageClauses || id.endsWith('Props')) return id;
        return `{ ${node.members.filter(ts.isPropertySignature).map(member => `${member.name.getText()}${member.questionToken ? '?' : ''}: ${expand(member.type.getText(), next)}`).join('; ')} }`;
      });

  const props = new Map();
  const inherited = [];
  const addMembers = members => {
    for (const member of members) {
      if (!ts.isPropertySignature(member) || !member.type) continue;
      const propName = ts.isStringLiteral(member.name) ? member.name.text : member.name.getText();
      const required = !member.questionToken;
      const type = expand(member.type.getText()).replace(required ? /$^/ : / \| undefined$/, '');
      const previous = props.get(propName);
      // 유니언으로 나뉜 props는 한 항목으로 합치고, 한쪽에서만 필수면 선택으로 봐요.
      if (previous) {
        const wrap = value => (value.includes('=>') && !value.startsWith('((') ? `(${value})` : value);
        if (previous.type !== type) previous.type = `${wrap(previous.type)} | ${wrap(type)}`;
        previous.required &&= required;
        continue;
      }
      const comment = ts.getJSDocCommentsAndTags(member).find(ts.isJSDoc)?.comment;
      const fallback = ts.getJSDocTags(member).find(tag => tag.tagName.text === 'default')?.comment;
      props.set(propName, {
        name: propName,
        type,
        required,
        default: fallback ? oneLine(ts.getTextOfJSDocComment(fallback)) : null,
        description: comment ? oneLine(ts.getTextOfJSDocComment(comment)) : null,
      });
    }
  };
  const visit = type => {
    if (ts.isTypeLiteralNode(type)) return addMembers(type.members);
    if (ts.isUnionTypeNode(type) || ts.isIntersectionTypeNode(type)) return type.types.forEach(visit);
    if (ts.isParenthesizedTypeNode(type)) return visit(type.type);
    const id = type.typeArguments ? undefined : ts.isTypeReferenceNode(type) ? type.typeName : ts.isExpressionWithTypeArguments(type) ? type.expression : undefined;
    const local = id && ts.isIdentifier(id) ? declarations.get(id.text) : undefined;
    if (local) return visitDeclaration(local);
    inherited.push(oneLine(type.getText()));
  };
  const visitDeclaration = node => {
    if (ts.isTypeAliasDeclaration(node)) return visit(node.type);
    addMembers(node.members);
    for (const clause of node.heritageClauses ?? []) clause.types.forEach(visit);
  };
  visitDeclaration(root);
  return { props: [...props.values()], extends: [...new Set(inherited)].join(' & ') || null };
}

/** 선언 위의 가장 가까운 주석을 구역 이름으로 삼아 CSS 변수를 묶어요. */
export function parseTokens(css) {
  const groups = [];
  let group = null;
  for (const match of css.matchAll(/\/\*([\s\S]*?)\*\/|(--[\w-]+)\s*:\s*([^;]+);/g)) {
    if (match[1] !== undefined) {
      group = match[1].trim().split('\n')[0].trim() || null;
      continue;
    }
    if (groups.at(-1)?.group !== group) groups.push({ group, tokens: {} });
    groups.at(-1).tokens[match[2]] = oneLine(match[3]);
  }
  return groups;
}

export function parseGuide(filename, text) {
  const topic = filename.replace(/\.md$/, '');
  assert.ok(GUIDE_TOPICS.includes(topic), `허용하지 않는 가이드 주제예요: ${topic}`);
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, `frontmatter가 없어요: ${filename}`);
  const meta = Object.fromEntries(match[1].split('\n').map(line => line.match(/^(\w+):\s*(.+)$/)?.slice(1)).filter(Boolean));
  assert.ok(meta.title && meta.description, `title과 description이 필요해요: ${filename}`);
  return { topic, title: meta.title, description: meta.description, body: match[2].trim() };
}

export function generateContent({ guidesDirectory = join(docs, 'content/source/guides') } = {}) {
  // 배포 파일과 같은 JSON을 메모리에서 바로 읽어 오래된 .artifacts를 쓰지 않게 해요.
  const { index, artifacts } = generateRegistry();
  const items = new Map(index.items.map(item => [item.id, JSON.parse(artifacts.get(item.filename))]));
  const filesOf = (id, seen = new Set()) => {
    if (seen.has(id)) return [];
    seen.add(id);
    const item = items.get(id);
    return [...item.files, ...item.dependencies.flatMap(dependency => filesOf(dependency, seen))];
  };

  const components = [...items.values()]
    .filter(item => item.kind === 'component')
    .map(item => {
      const entry = item.files.find(file => file.path === item.entry.path);
      assert.ok(entry, `진입 파일이 없어요: ${item.name}`);
      return { name: item.name, id: item.id, description: item.description, entry: item.entry, sections: parseSections(item.name, entry.content), ...parseProps(item.name, filesOf(item.id)) };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));

  const tokenFiles = new Map(items.get('tokens').files.map(file => [file.path, file.content]));
  const tokens = Object.fromEntries(
    Object.entries(TOKEN_FILES).map(([category, path]) => {
      assert.ok(tokenFiles.has(path), `토큰 파일이 없어요: ${path}`);
      return [category, parseTokens(tokenFiles.get(path))];
    }),
  );

  const guides = existsSync(guidesDirectory)
    ? readdirSync(guidesDirectory).filter(name => name.endsWith('.md')).sort().map(name => parseGuide(name, readFileSync(join(guidesDirectory, name), 'utf8')))
    : [];

  const harnessMinimum = JSON.parse(readFileSync(join(docs, 'content/source/versions.json'), 'utf8')).harness.minimum;
  const harnessVersion = JSON.parse(readFileSync(join(docs, '../../packages/harness/package.json'), 'utf8')).version;
  assert.match(index.version, SEMVER, 'UI 콘텐츠 버전은 온전한 SemVer여야 해요.');
  assert.match(harnessMinimum, SEMVER, 'harness.minimum은 온전한 SemVer여야 해요.');
  // 아직 없는 하네스 버전을 요구하면 모든 사용자에게 올릴 수 없는 업데이트를 안내하게 돼요.
  assert.ok(harnessMinimum.localeCompare(harnessVersion, 'en', { numeric: true }) <= 0, `harness.minimum(${harnessMinimum})이 하네스 버전(${harnessVersion})보다 높아요.`);

  return { version: index.version, harnessMinimum, components, tokens, guides };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const content = generateContent();
  await mkdir(join(docs, 'content/generated'), { recursive: true });
  await writeFile(join(docs, 'content/generated/data.ts'), `// 생성 파일이에요. 직접 고치지 않아요.\nimport type { Content } from '../schema.ts';\n\nexport const content: Content = ${JSON.stringify(content, null, 2)};\n`);
  console.log(`문서 데이터 ${content.version}: 컴포넌트 ${content.components.length}개, 가이드 ${content.guides.length}개를 생성했어요.`);
}
