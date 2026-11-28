// 원격 MCP의 조회 계층을 실제 생성 데이터로 확인해요. `pnpm test:docs`가 먼저 데이터를 만들어요.
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { getComponent, getGuide, getProps, getTokens, getVersions, listComponents, search } from '../../apps/docs/content/query.ts';
import { approvedGuide, generateContent, loadGuides, parseGuide, parseProps, parseTokens, renderSections } from '../../apps/docs/scripts/build-content.mjs';

test('목록은 이름·ID·상태·설명만 이름순으로 줘요', () => {
  const { components } = listComponents();
  assert.deepEqual(Object.keys(components[0]), ['name', 'id', 'status', 'description']);
  assert.deepEqual(components.map(item => item.name), components.map(item => item.name).sort());
  assert.ok(components.some(item => item.name === 'Button' && item.id === 'button'));
  // 사용자 승인을 반영한 추가 문서도 stable 상태로 알려요.
  assert.equal(components.find(item => item.name === 'Divider').status, 'stable');
  assert.ok(listComponents({ status: 'STABLE' }).components.length > 0 && listComponents({ status: 'STABLE' }).components.every(item => item.status === 'stable'));
  assert.deepEqual(listComponents({ status: 'review' }).error.allowed, ['draft', 'stable']);
});

test('컴포넌트는 요청한 섹션만 줘요', () => {
  const basic = getComponent({ name: 'button' });
  assert.equal(basic.name, 'Button');
  assert.deepEqual(basic.entry, { path: 'button.tsx', export: 'Button' });
  assert.deepEqual(Object.keys(basic.sections), ['summary', 'when-to-use']);
  assert.ok(basic.available.includes('examples') && basic.available.includes('do-dont'));
  assert.equal(basic.status, 'stable');
  // 원문 경로·해시·검토 메모는 응답에 담지 않아요.
  assert.doesNotMatch(JSON.stringify(getComponent({ name: 'Button', sections: basic.available })), /sha256|source\/components|implementationGaps/);
  // 새 승인본도 요청한 예시·접근성 섹션만 반환해요.
  const modal = getComponent({ name: 'Modal', sections: ['examples', 'accessibility'] });
  assert.equal(modal.status, 'stable');
  assert.deepEqual(Object.keys(modal.sections), ['examples', 'accessibility']);
  assert.match(modal.sections.examples, /onOpenChange/);
  assert.match(modal.sections.accessibility, /dialog/);

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

test('생성 스크립트는 가이드 JSON·타입·CSS·가이드를 규격대로 나눠요', () => {
  const guide = {
    schemaVersion: 1, id: 'button', name: 'Button', status: 'draft', source: { markdown: null, sha256: null }, summary: '요약이에요.',
    usage: { recommended: ['써요'], avoid: null }, choices: [{ props: { variant: 'solid', size: 2 }, role: '주요', when: '강조할 때' }],
    structure: { description: null, note: null }, content: { text: [], icon: null, limits: null }, interaction: { states: ['Default'], behavior: null, limitations: null },
    composition: [{ components: ['Button', 'Modal'], purpose: '확인해요.', guidance: null }], customization: null, accessibility: ['라벨을 줘요'],
    examples: [{ title: '기본', code: '<Button />' }], related: ['Modal'], review: { questions: [], implementationGaps: [] },
  };
  // null과 빈 배열인 필드로는 섹션을 만들지 않아요.
  assert.deepEqual(renderSections(guide), {
    summary: '요약이에요.',
    'when-to-use': '**이럴 때 써요**\n- 써요',
    examples: '**기본**\n```tsx\n<Button />\n```',
    variants: '**선택 기준**\n- `variant="solid"` `size=2` — 주요: 강조할 때\n\n**상태**\n- Default',
    accessibility: '- 라벨을 줘요',
    related: '**함께 쓰는 조합**\n- Button + Modal — 확인해요.\n\n**관련 컴포넌트**: Modal',
  });

  // 검토 전 초안의 내용은 일반 응답에 내보내지 않아요.
  assert.equal(approvedGuide(guide), undefined);
  assert.equal(approvedGuide({ ...guide, status: 'stable' }).status, 'stable');
  assert.equal(approvedGuide(undefined), undefined);

  const registered = [{ id: 'button', name: 'Button' }, { id: 'modal', name: 'Modal' }];
  const directory = mkdtempSync(join(tmpdir(), 'eli-guides-'));
  const write = value => writeFileSync(join(directory, 'button.json'), JSON.stringify(value));
  write(guide);
  assert.equal(loadGuides(directory, registered, directory).get('button').name, 'Button');
  write({ ...guide, related: ['Dialog'] });
  assert.throws(() => loadGuides(directory, registered, directory), /없는 컴포넌트를 가리켜요/);
  write({ ...guide, name: 'Btn' });
  assert.throws(() => loadGuides(directory, registered, directory), /공개 컴포넌트가 아니에요/);
  writeFileSync(join(directory, 'source.md'), '원문');
  write({ ...guide, source: { markdown: 'source.md', sha256: '0'.repeat(64) } });
  assert.throws(() => loadGuides(directory, registered, directory), /원문이 바뀌었어요/);
  write({ ...guide, status: 'stable', review: { questions: ['미정'], implementationGaps: [] } });
  assert.throws(() => loadGuides(directory, registered, directory), /stable 조건/);

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


test('문서·MCP 생성 데이터에는 폰트 바이너리 본문을 노출하지 않아요', () => {
  const text = JSON.stringify(generateContent());
  const sample = readFileSync(new URL('../../packages/ui/src/font/PretendardVariable.woff2', import.meta.url)).toString('base64').slice(0, 128);
  assert.ok(!text.includes(sample));
  assert.doesNotMatch(text, /"encoding":"base64"/);
});
