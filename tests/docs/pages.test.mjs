import ts from 'typescript';
import { mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { componentPages } from '../../apps/docs/frontend/features/docs-catalog/catalog.ts';
import { getDocPage } from '../../apps/docs/frontend/pages/components/data/getDocPage.ts';
import { parseGuidance } from '../../apps/docs/frontend/pages/components/data/parseGuidance.ts';
import { getProps, listComponents } from '../../apps/docs/content/query.ts';
import { installationCommand } from '../../apps/docs/frontend/pages/components/data/installation.ts';
import { generateRegistry } from '../../scripts/build-registry.mjs';
import { groupDocProps, orderDocProps } from '../../apps/docs/frontend/pages/components/data/orderDocProps.ts';
import { parseObjectListType } from '../../apps/docs/frontend/pages/components/data/parseObjectListType.ts';

test('모든 문서는 같은 API를 읽고 목차·예시 ID를 중복하지 않아요', () => {
  for (const { id } of componentPages) {
    const page = getDocPage(id);
    assert.ok(page && page.summary && page.examples.length > 0);
    assert.deepEqual(page.api, getProps({ name: id }));
    for (const part of page.related) assert.deepEqual(part.api, getProps({ name: part.id }));
    const ids = page.headings.flatMap(heading => [heading.id, ...(heading.children?.map(child => child.id) ?? [])]);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(page.hasToc, true);
    assert.ok(!page.examples[0].code.includes('<>'));
    assert.ok(page.examples.slice(1).every(example => ids.includes(`example-${example.id}`)));
    assert.match(page.importCode, new RegExp(`components/ui/${id}`));
  }
  assert.equal(getDocPage('not-a-component'), null);
});

test('초기 설정과 선택 설치 명령을 패키지 매니저별로 구분해요', () => {
  for (const [installer, prefix] of [['npm', 'npx'], ['pnpm', 'pnpm dlx'], ['yarn', 'yarn dlx'], ['bun', 'bunx']]) {
    assert.equal(installationCommand(installer, 'init', 'modal'), `${prefix} eli-design@latest init`);
    assert.equal(installationCommand(installer, 'add', 'modal'), `${prefix} eli-design@latest add modal`);
  }
});

test('모든 전체 실행 예시와 정적 핵심 코드가 실제 설치 소스로 타입 검사돼요', async () => {
  const work = resolve('.artifacts/docs-pages/type-consumer');
  await rm(work, { recursive: true, force: true });
  await mkdir(join(work, 'components'), { recursive: true });
  await symlink(resolve('apps/docs/frontend/shared/ui'), join(work, 'components/ui'), 'junction');
  const files = [];
  for (const { id } of componentPages) {
    const page = getDocPage(id);
    for (const example of page.examples) {
      const source = example.fullCode ?? `${page.importCode}\nexport default function Example() { return <>${example.code}</>; }`;
      const file = join(work, `${id}-${example.id}.tsx`);
      await writeFile(file, source);
      files.push(file);
    }
  }
  const program = ts.createProgram(files, {
    noEmit: true, strict: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX, allowImportingTsExtensions: true, esModuleInterop: true,
  });
  const errors = ts.getPreEmitDiagnostics(program);
  const host = { getCanonicalFileName: file => file, getCurrentDirectory: () => process.cwd(), getNewLine: () => '\n' };
  assert.equal(errors.length, 0, ts.formatDiagnosticsWithColorAndContext(errors, host));
  assert.equal(files.length, componentPages.reduce((sum, { id }) => sum + getDocPage(id).examples.length, 0));
  assert.ok(files.length > 24);
});

test('예시는 프레임워크 선언 없이 제공하고 필요한 별도 소스를 명시해요', () => {
  const known = new Set(listComponents().components.map(item => item.id));
  for (const { id } of componentPages) for (const example of getDocPage(id).examples) {
    assert.doesNotMatch(example.fullCode ?? example.code, /^['"]use client['"]/);
    for (const item of example.install ?? []) assert.ok(known.has(item), `실제 설치할 수 없는 항목: ${item}`);
  }
  assert.deepEqual(getDocPage('chip').examples.find(item => item.id === 'filter').install, ['filter-chip']);
  assert.deepEqual(getDocPage('fab').installationIds, ['fab']);
  assert.equal(getDocPage('fab').examples.find(item => item.id === 'menu').install, undefined);
  assert.deepEqual(getDocPage('navigation-drawer').installationIds, ['navigation-drawer']);
  for (const id of ['fab', 'navigation-drawer']) assert.equal(getDocPage(id).installationStatus, 'planned');
});

test('현재 설치로 해결되는 import와 명시적으로 선반영한 설치의 미완료 범위를 구분해요', () => {
  const plannedGaps = {
    fab: { menu: ['fab-menu.tsx'] },
    'navigation-drawer': { basic: ['navigation-drawer-category.tsx', 'navigation-drawer-menu.tsx'], controlled: ['navigation-drawer-category.tsx', 'navigation-drawer-menu.tsx'] },
  };
  const { artifacts } = generateRegistry();
  const collect = (ids, seen = new Set()) => {
    for (const id of ids) {
      if (seen.has(id)) continue;
      seen.add(id);
      collect(JSON.parse(artifacts.get(`${id}.json`)).dependencies, seen);
    }
    return seen;
  };
  for (const { id } of componentPages) {
    const page = getDocPage(id);
    const missing = {};
    for (const example of page.examples) {
      const installed = collect([...page.installationIds, ...(example.install ?? [])]);
      const files = new Set([...installed].flatMap(item => JSON.parse(artifacts.get(`${item}.json`)).files.map(file => file.path)));
      const source = ts.createSourceFile('example.tsx', example.fullCode ?? `${page.importCode}\n${example.code}`, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      for (const statement of source.statements) {
        if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
        const module = statement.moduleSpecifier.text;
        if (module.startsWith('./components/ui/')) {
          const file = `${module.slice('./components/ui/'.length)}.tsx`;
          if (!files.has(file)) (missing[example.id] ??= []).push(file);
        }
      }
      if (missing[example.id]) missing[example.id].sort();
    }
    assert.equal(page.installationStatus === 'planned', id in plannedGaps);
    assert.deepEqual(missing, plannedGaps[id] ?? {}, `${id}: 현재 의존성과 기록한 선반영 범위가 달라요. 설치 구현 후 예정 상태와 이 기록도 해제해주세요.`);
  }
});

test.todo('add fab 하나로 FabMenu·FabMenuSegment까지 설치되는지 실제 소비 검사로 확인해요');
test.todo('add navigation-drawer 하나로 Category·Menu·Item까지 설치되는지 실제 소비 검사로 확인해요');

test('선택 기준은 승인된 사용 상황과 속성 조합을 누락 없이 구분해요', () => {
  for (const [id, count] of [['button', 8], ['badge', 4], ['modal', 0]]) {
    const source = getDocPage(id).guidance;
    const groups = parseGuidance(source);
    const choices = groups.flatMap(group => group.choices ?? []);
    assert.equal(choices.length, count);
    for (const choice of choices) assert.ok(source.includes(`${choice.props} — ${choice.role}: ${choice.when}`));
    for (const group of groups) for (const block of group.blocks) {
      if (block.type === 'list') for (const item of block.items) assert.ok(source.includes(item));
    }
  }
  const unknown = parseGuidance('**선택 기준**\n- 다른 형식의 안내도 버리지 않아요.');
  assert.equal(unknown[0].choices, null);
  assert.deepEqual(unknown[0].blocks, [{ type: 'list', items: ['다른 형식의 안내도 버리지 않아요.'] }]);
});

test('API 표시 순서는 원본을 유지하며 필수·역할 순서로 정렬하고 className은 마지막에 둬요', () => {
  const props = ['className', 'onClick', 'disabled', 'size', 'children', 'variant', 'color', 'aria-label', 'width'].map(name => ({ name, required: name === 'aria-label' }));
  const original = structuredClone(props);
  assert.deepEqual(orderDocProps(props).map(prop => prop.name), ['aria-label', 'children', 'color', 'variant', 'size', 'disabled', 'onClick', 'width', 'className']);
  assert.deepEqual(props, original);
  for (const component of listComponents().components) {
    const props = getProps({ name: component.id }).props;
    assert.ok(props.some(prop => prop.name === 'className'), component.name);
    assert.equal(orderDocProps(props).at(-1).name, 'className');
  }
  assert.deepEqual(orderDocProps([{ name: 'onLater' }, { name: 'onEarlier' }]).map(prop => prop.name), ['onLater', 'onEarlier']);
});

test('구성 요소의 API는 같은 페이지에 두고 독립적인 선택 기준만 표시해요', () => {
  const bar = getDocPage('navigation-bar');
  assert.equal(bar.mobileOnly, true);
  assert.deepEqual(bar.related.map(part => part.id), ['navigation-bar-item']);
  assert.deepEqual(bar.guidanceItems.map(part => part.id), ['navigation-bar']);
  assert.equal(bar.examples.some(example => example.id === 'glass'), false);
  const glass = getDocPage('navigation-bar-glass');
  assert.equal(glass.mobileOnly, true);
  assert.deepEqual(glass.related.map(part => part.id), ['navigation-bar-glass-item']);
  assert.deepEqual(glass.installationIds, ['navigation-bar-glass']);
  assert.deepEqual(glass.guidanceItems.map(part => part.id), ['navigation-bar-glass']);
  for (const id of ['navigation-bar-item', 'navigation-bar-glass-item']) assert.equal(getDocPage(id), null);
  const drawer = getDocPage('navigation-drawer');
  assert.deepEqual(drawer.guidanceItems.map(part => part.id), ['navigation-drawer']);
  for (const part of drawer.related) {
    assert.ok(part.isPart && part.summary && part.composition);
    assert.doesNotMatch(part.composition, /이럴 때 써요|이럴 때는 쓰지 않아요/);
    assert.ok(part.composition.includes(part.details));
  }
  const menu = drawer.related.find(part => part.id === 'navigation-drawer-menu');
  assert.ok(menu.composition.includes('하위 메뉴가 있는 Main Menu에 이동 동작을 동시에 연결하지 않아요.'));
  assert.ok(menu.composition.includes('중복 value를 사용하거나 펼침 동작을 화살표 클릭에만 한정하지 않아요.'));
  assert.ok(drawer.related.find(part => part.id === 'navigation-drawer-item').composition.includes('variant="sub-menu"'));
  for (const id of ['navigation-bar', 'navigation-bar-glass']) {
    const type = getProps({ name: id }).props.find(prop => prop.name === 'items').type;
    const list = parseObjectListType(type);
    assert.equal(list.label, 'readonly { … }[]');
    assert.deepEqual(list.fields.map(field => field.name), ['value', 'label', 'outlinedIcon', 'filledIcon']);
    assert.ok(list.fields.every(field => !field.optional));
  }
  assert.equal(parseObjectListType('readonly { value: { id: string } }[]'), null);
  assert.equal(parseObjectListType("{ label: 'a;b' }[]"), null);
  assert.equal(parseObjectListType('readonly NavigationDrawerSubItem[]'), null);
  assert.equal(parseObjectListType('string'), null);
});

test('구성도는 실제 부품과 직접 조립·자동 구성의 차이를 유지해요', () => {
  const knownNames = new Set(listComponents().components.map(component => getProps({ name: component.id }).name));
  const { artifacts } = generateRegistry();
  for (const { id } of componentPages) {
    const page = getDocPage(id);
    const assembly = page.assembly;
    assert.equal(page.headings.some(heading => heading.id === 'composition'), Boolean(assembly));
    if (!assembly) continue;
    assert.ok(knownNames.has(assembly.name));
    for (const part of assembly.parts) {
      assert.ok(part.role);
      if (part.id) assert.ok(knownNames.has(part.name));
      else assert.equal(part.internalName, 'Dim');
      if (part.internal) assert.ok(knownNames.has(part.internal));
    }
    if (assembly.mode === 'automatic') {
      const root = listComponents().components.find(component => component.name === assembly.name);
      const collect = (id, seen = new Set()) => {
        if (seen.has(id)) return seen;
        seen.add(id);
        for (const dependency of JSON.parse(artifacts.get(`${id}.json`)).dependencies) collect(dependency, seen);
        return seen;
      };
      const dependencies = collect(root.id);
      for (const part of assembly.parts) if (part.id) assert.ok(dependencies.has(part.id), `${assembly.name}에서 ${part.name} 참조 누락`);
    }
  }
  const drawer = getDocPage('navigation-drawer').assembly;
  assert.equal(drawer.mode, 'manual');
  assert.equal(drawer.parts[0].optional, true);
  assert.equal(drawer.parts[1].internal, 'NavigationDrawerItem');
  assert.equal(getDocPage('button').assembly, null);
});


test('모든 문서는 예시를 중복하지 않고 실제 속성·소유 컴포넌트·기본값과 연결해요', () => {
  for (const { id } of componentPages) {
    const page = getDocPage(id);
    assert.equal(page.referenceHeading.title, '전체 속성');
    assert.equal(page.referenceHeading.id, 'api');
    const cases = page.exampleGroups.flatMap(group => group.examples);
    assert.equal(new Set(cases.map(example => example.id)).size, cases.length);
    assert.deepEqual(new Set(cases.map(example => example.id)), new Set(page.examples.slice(1).map(example => example.id)));
    for (const example of cases) {
      assert.ok(example.section);
      if (example.section === 'examples') {
        assert.equal(example.propertyInfo, null);
        continue;
      }
      const api = example.component ? getProps({ name: example.component }) : page.api;
      const names = [example.property, ...(example.relatedProperties ?? [])];
      for (const name of names) assert.ok(api.props.some(prop => prop.name === name));
      const prop = api.props.find(prop => prop.name === example.property);
      assert.equal(example.title, names.join(' · '));
      assert.equal(example.propertyInfo.name, prop.name);
      assert.equal(example.propertyInfo.default, prop.default);
      assert.equal(example.propertyOwner, example.component ? api.name : null);
      if (example.component) assert.ok(page.related.some(part => part.id === example.component));
    }
    for (const { api } of [page, ...page.related]) {
      const groups = groupDocProps(api.props);
      assert.deepEqual(new Set(groups.flatMap(group => group.props.map(prop => prop.name))), new Set(api.props.map(prop => prop.name)));
      assert.equal(groups.at(-1).props.at(-1).name, 'className');
      for (const group of groups) for (const prop of group.props) assert.deepEqual(prop, api.props.find(item => item.name === prop.name));
    }
  }
  const groups = getDocPage('button').exampleGroups;
  assert.deepEqual(groups.find(group => group.id === 'properties').examples.map(example => example.id), ['sizes', 'variants', 'colors', 'icons']);
  assert.deepEqual(groups.find(group => group.id === 'interactions').examples.map(example => example.id), ['disabled', 'click']);
  assert.equal(getDocPage('badge').exampleGroups.some(group => group.id === 'interactions'), false);
  assert.deepEqual(getDocPage('divider').exampleGroups, []);
  assert.deepEqual(getDocPage('tooltip').exampleGroups.map(group => group.id), ['examples']);
  assert.equal(getDocPage('modal').exampleGroups[0].examples[0].title, 'title · message · subMessage');
});
