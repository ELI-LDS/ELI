// 검토한 컴포넌트 가이드 JSON과 레지스트리 JSON에서 문서 데이터를 만들어 content/generated/data.ts에 써요.
// 섹션은 content/components의 가이드 JSON, props는 레지스트리의 타입 선언, 토큰은 tokens 항목의 CSS에서 가져와요.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { generateRegistry } from '../../../scripts/build-registry.mjs';
import { GUIDE_STATUSES, GUIDE_TOPICS, TOKEN_FILES } from '../content/schema.ts';

const docs = fileURLToPath(new URL('../', import.meta.url));
const repository = join(docs, '../..');
const SEMVER = /^\d+\.\d+\.\d+$/;
const oneLine = text => text.replace(/\s+/g, ' ').trim();

const bullets = (title, items) => (items?.length ? `${title ? `**${title}**\n` : ''}${items.map(item => `- ${item}`).join('\n')}` : '');
const compose = (...blocks) => blocks.filter(Boolean).join('\n\n');

/** 가이드 JSON의 필드를 섹션 키별 마크다운으로 표현해요. 대응은 Agent/mcp-spec.md의 표를 따라요. */
export function renderSections(guide) {
  const choices = guide.choices?.map(choice => `- ${Object.entries(choice.props).map(([name, value]) => `\`${name}=${JSON.stringify(value)}\``).join(' ')}${choice.role ? ` — ${choice.role}` : ''}: ${choice.when}`);
  const sections = {
    summary: compose(guide.summary, bullets('구조', [guide.structure.description, guide.structure.note].filter(Boolean))),
    'when-to-use': compose(bullets('이럴 때 써요', guide.usage.recommended), bullets('이럴 때는 쓰지 않아요', guide.usage.avoid)),
    examples: compose(...(guide.examples ?? []).map(example => `**${example.title}**\n\`\`\`tsx\n${example.code}\n\`\`\``)),
    variants: compose(choices?.length ? `**선택 기준**\n${choices.join('\n')}` : '', bullets('상태', guide.interaction.states), bullets('동작', guide.interaction.behavior), bullets('제공하지 않는 것', guide.interaction.limitations)),
    'do-dont': compose(bullets('피해요', guide.usage.avoid), bullets('문구', guide.content.text), bullets('아이콘', guide.content.icon), bullets('제한', guide.content.limits), bullets('커스터마이징', guide.customization)),
    accessibility: bullets('', guide.accessibility),
    related: compose(bullets('함께 쓰는 조합', guide.composition?.map(item => `${item.components.join(' + ')} — ${item.purpose}${item.guidance ? ` ${item.guidance}` : ''}`)), guide.related?.length ? `**관련 컴포넌트**: ${guide.related.join(', ')}` : ''),
    styling: bullets('', guide.customization),
  };
  // 내용이 없는 섹션은 만들지 않아요. 조회 계층이 응답과 available에서 빼요.
  return Object.fromEntries(Object.entries(sections).filter(([, text]) => text));
}

/** 사용자가 승인한(stable) 가이드만 일반 응답에 내보내요. 초안은 상태만 알리고 내용은 담지 않아요. */
export const approvedGuide = guide => (guide?.status === 'stable' ? guide : undefined);

/** 가이드 JSON을 읽고 레지스트리의 공개 컴포넌트·원문 해시·참조와 대조해요. */
export function loadGuides(directory, components, repository) {
  const names = new Set(components.map(component => component.name));
  const guides = new Map();
  for (const filename of existsSync(directory) ? readdirSync(directory).filter(name => name.endsWith('.json')).sort() : []) {
    const guide = JSON.parse(readFileSync(join(directory, filename), 'utf8'));
    const component = components.find(item => item.id === guide.id);
    assert.equal(`${guide.id}.json`, filename, `파일 이름과 id가 달라요: ${filename}`);
    assert.equal(guide.schemaVersion, 1, `지원하지 않는 가이드 형식이에요: ${filename}`);
    assert.ok(component && component.name === guide.name, `공개 컴포넌트가 아니에요: ${filename}`);
    assert.ok(GUIDE_STATUSES.includes(guide.status), `허용하지 않는 상태예요: ${filename}`);
    for (const name of [...(guide.related ?? []), ...(guide.composition ?? []).flatMap(item => item.components)]) assert.ok(names.has(name), `없는 컴포넌트를 가리켜요: ${filename} → ${name}`);
    if (guide.source.markdown) assert.equal(createHash('sha256').update(readFileSync(join(repository, guide.source.markdown))).digest('hex'), guide.source.sha256, `원문이 바뀌었어요. JSON을 다시 검토해요: ${filename}`);
    if (guide.status === 'stable') assert.ok(guide.summary && guide.examples?.length && !guide.review.questions.length && !guide.review.implementationGaps.length, `stable 조건을 채우지 못했어요: ${filename}`);
    guides.set(guide.id, guide);
  }
  return guides;
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
  // variant별 유니언의 한쪽에만 필요한 속성을 모든 사용법의 필수값으로 안내하지 않아요.
  const requiredOf = (node, seen = new Set()) => {
    if (ts.isUnionTypeNode(node) || ts.isIntersectionTypeNode(node)) {
      const groups = node.types.map(type => requiredOf(type, seen));
      return ts.isUnionTypeNode(node)
        ? new Set([...groups[0]].filter(name => groups.every(group => group.has(name))))
        : new Set(groups.flatMap(group => [...group]));
    }
    if (ts.isParenthesizedTypeNode(node)) return requiredOf(node.type, seen);
    if (ts.isTypeAliasDeclaration(node)) return requiredOf(node.type, seen);
    if (ts.isInterfaceDeclaration(node) || ts.isTypeLiteralNode(node)) {
      const names = new Set(node.members.filter(member => ts.isPropertySignature(member) && !member.questionToken).map(member => member.name.getText()));
      for (const clause of node.heritageClauses ?? []) for (const type of clause.types) {
        for (const name of requiredOf(type, seen)) names.add(name);
      }
      return names;
    }
    const name = !node.typeArguments && (ts.isTypeReferenceNode(node) ? node.typeName.getText() : ts.isExpressionWithTypeArguments(node) ? node.expression.getText() : undefined);
    const local = declarations.get(name);
    return local && !seen.has(name) ? requiredOf(local, new Set([...seen, name])) : new Set();
  };
  const required = requiredOf(root);
  for (const prop of props.values()) prop.required = required.has(prop.name);
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

export function generateContent({ guidesDirectory = join(docs, 'content/source/guides'), componentsDirectory = join(docs, 'content/components') } = {}) {
  // 배포 파일과 같은 JSON을 메모리에서 바로 읽어 오래된 .artifacts를 쓰지 않게 해요.
  const { index, artifacts } = generateRegistry();
  const items = new Map(index.items.map(item => [item.id, JSON.parse(artifacts.get(item.filename))]));
  const filesOf = (id, seen = new Set()) => {
    if (seen.has(id)) return [];
    seen.add(id);
    const item = items.get(id);
    return [...item.files, ...item.dependencies.flatMap(dependency => filesOf(dependency, seen))];
  };

  const registered = [...items.values()].filter(item => item.kind === 'component');
  const componentGuides = loadGuides(componentsDirectory, registered, repository);
  // 가이드가 없거나 검토 전인 공개 컴포넌트도 목록·props에는 나와요. 없는 사용 기준을 만들어 채우지 않아요.
  const components = registered
    .map(item => {
      const guide = componentGuides.get(item.id);
      const approved = approvedGuide(guide);
      return { name: item.name, id: item.id, description: approved?.summary ?? item.description, status: guide?.status ?? null, entry: item.entry, sections: approved ? renderSections(approved) : {}, ...parseProps(item.name, filesOf(item.id)) };
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
