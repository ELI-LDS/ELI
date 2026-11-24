// 원격 MCP의 조회 계층을 실제 생성 데이터로 확인해요. `pnpm test:docs`가 먼저 데이터를 만들어요.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getComponent, getGuide, getProps, getTokens, getVersions, listComponents, search } from '../../apps/docs/content/query.ts';
import { parseGuide, parseProps, parseSections, parseTokens } from '../../apps/docs/scripts/build-content.mjs';

test('목록은 이름·ID·설명만 이름순으로 줘요', () => {
  const { components } = listComponents();
  assert.deepEqual(Object.keys(components[0]), ['name', 'id', 'description']);
  assert.deepEqual(components.map(item => item.name), components.map(item => item.name).sort());
  assert.ok(components.some(item => item.name === 'Button' && item.id === 'button'));
});

test('컴포넌트는 요청한 섹션만 줘요', () => {
  const basic = getComponent({ name: 'button' });
  assert.equal(basic.name, 'Button');
  assert.deepEqual(basic.entry, { path: 'button.tsx', export: 'Button' });
  assert.deepEqual(Object.keys(basic.sections), ['summary', 'when-to-use']);
  assert.ok(basic.available.includes('examples'));
  // 문서에 없는 선택 섹션은 오류 없이 빠져요.
  assert.deepEqual(Object.keys(getComponent({ name: 'Button', sections: ['examples', 'do-dont'] }).sections), ['examples']);
});

test('없는 이름과 허용하지 않는 값은 allowed와 함께 알려요', () => {
  assert.deepEqual(getComponent({ name: 'Buton' }).error, { code: 'not_found', message: "컴포넌트 'Buton'을(를) 찾을 수 없어요.", allowed: ['Button'] });
  assert.equal(getComponent({ name: 'Button', sections: ['usage'] }).error.code, 'invalid_argument');
  assert.ok(getProps({ name: 'Button', names: ['colour'] }).error.allowed.includes('color'));
  assert.deepEqual(getTokens({ category: 'spacing' }).error.allowed, ['color', 'semantic-color', 'typography', 'layout']);
  assert.ok(getTokens({ category: 'semantic-color', group: 'nope' }).error.allowed.includes('Foreground'));
  assert.equal(getGuide({ topic: 'nope' }).error.code, 'not_found');
  assert.equal(search({ q: 'a' }).error.code, 'invalid_argument');
  assert.equal(search({ q: '버튼', limit: 21 }).error.code, 'invalid_argument');
});

test('props는 이름과 필드로 좁혀요', () => {
  const all = getProps({ name: 'Button' });
  assert.match(all.extends, /ButtonHTMLAttributes/);
  assert.deepEqual(all.props.find(prop => prop.name === 'variant'), { name: 'variant', type: "'solid' | 'outline' | 'ghost'", required: false, default: null, description: '버튼 형태예요. 기본값은 `solid`예요.' });
  assert.deepEqual(getProps({ name: 'Button', names: ['size'], fields: ['type'] }).props, [{ name: 'size', type: "'large' | 'medium'" }]);
});

test('토큰은 분류·구역·낱말로 좁혀요', () => {
  const index = getTokens();
  assert.deepEqual(index.categories.map(item => item.category), ['color', 'semantic-color', 'typography', 'layout']);
  assert.ok(!JSON.stringify(index).includes('--eli-'));
  assert.equal(getTokens({ category: 'layout', group: 'scale' }).groups[0].tokens['--eli-layout-scale-4'], '16px');
  const brand = getTokens({ category: 'semantic-color', q: 'brand' }).groups.flatMap(item => Object.keys(item.tokens));
  assert.ok(brand.length > 0 && brand.every(name => name.includes('brand')));
});

test('검색은 이름에서 일치한 문서를 먼저 주고 발췌는 200자 이하예요', () => {
  const { results } = search({ q: 'button', limit: 3 });
  assert.equal(results.length, 3);
  assert.match(results[0].id, /button/i);
  assert.ok(results.every(result => result.kind === 'component' && result.excerpt.length <= 200));
  assert.deepEqual(search({ q: '없는낱말없는낱말' }).results, []);
});

test('가이드 목록과 버전은 항상 같은 형식이에요', () => {
  assert.ok(Array.isArray(getGuide().guides));
  const versions = getVersions();
  for (const value of [versions.ui.latest, versions.ui.docs, versions.harness.minimum]) assert.match(value, /^\d+\.\d+\.\d+$/);
});

test('생성 스크립트는 JSDoc·타입·CSS·가이드를 규격대로 나눠요', () => {
  const doc = '/**\n * 설명이에요.\n *\n * @example 빠른 사용\n * ```tsx\n * <A />\n * ```\n *\n * ### 선택 가이드\n * - 골라요\n */';
  assert.deepEqual(parseSections('A', doc), { summary: '설명이에요.', examples: '**빠른 사용**\n```tsx\n<A />\n```', 'when-to-use': '- 골라요' });
  assert.throws(() => parseSections('A', '/**\n * 설명\n * ### 모르는 제목\n */'), /허용하지 않는 JSDoc 제목/);

  const types = "type Size = 'a' | 'b';\ninterface Option { value: string }\ninterface Base extends HTMLAttributes<HTMLDivElement> {\n  /** 크기예요. @default 'a' */\n  size?: Size | undefined;\n}\nexport type AProps = (Base & { mode?: 'one'; onPick: (v: number) => void }) | (Base & { mode: 'two'; onPick: (v: string) => void; options: readonly Option[] });";
  assert.deepEqual(parseProps('A', [{ path: 'a.types.ts', content: types }]), {
    props: [
      { name: 'size', type: "'a' | 'b'", required: false, default: "'a'", description: '크기예요.' },
      { name: 'mode', type: "'one' | 'two'", required: false, default: null, description: null },
      { name: 'onPick', type: '((v: number) => void) | ((v: string) => void)', required: true, default: null, description: null },
      { name: 'options', type: 'readonly { value: string }[]', required: true, default: null, description: null },
    ],
    extends: 'HTMLAttributes<HTMLDivElement>',
  });

  assert.deepEqual(parseTokens('/* 파일 설명 */\n:root {\n  /* Scale */\n  --a: 4px;\n  --b:\n    var(--a);\n}\n/* Mobile */\n@media (max-width: 1px) { :root { --a: 2px; } }'), [
    { group: 'Scale', tokens: { '--a': '4px', '--b': 'var(--a)' } },
    { group: 'Mobile', tokens: { '--a': '2px' } },
  ]);

  assert.deepEqual(parseGuide('install.md', '---\ntitle: 설치\ndescription: 설치 방법\n---\n\n본문'), { topic: 'install', title: '설치', description: '설치 방법', body: '본문' });
  assert.throws(() => parseGuide('random.md', '---\ntitle: a\ndescription: b\n---\n'), /허용하지 않는 가이드 주제/);
});
