import assert from 'node:assert/strict';
import { test } from 'node:test';
import { highlightCode } from '../../apps/docs/frontend/features/code-block/highlightCode.ts';
import { parseDocument } from '../../apps/docs/frontend/pages/components/data/parseDocument.ts';

const sourceOf = lines => lines.map(line => line.map(token => token.text).join('')).join('\n');

test('여러 줄 주석과 TSX 속성·문자열을 구분하면서 원문을 보존해요', () => {
  const code = '/* 첫 번째 줄\n두 번째 줄 */\nexport const Example = () => <Button className="save" disabled={false}>저장</Button>;\n';
  const lines = highlightCode(code, 'tsx');
  assert.equal(sourceOf(lines), code);
  assert.ok(lines[1].some(token => token.className.includes('comment')));
  assert.ok(lines.flat().some(token => token.text.includes('export') && token.className.includes('keyword')));
  assert.ok(lines.flat().some(token => token.text === 'className' && token.className.includes('attr-name')));
});

test('코드 안의 HTML·빈 줄·공백은 실행용 HTML로 바꾸지 않아요', () => {
  const code = 'const html = "<img src=x onerror=alert(1)>";\r\n  \r\n';
  assert.equal(sourceOf(highlightCode(code, 'tsx')), code.replace(/\r\n/g, '\n'));
  assert.equal(sourceOf(highlightCode(code, 'unknown-language')), code.replace(/\r\n/g, '\n'));
  assert.deepEqual(highlightCode('', 'tsx'), [[]]);
});

test('Fragment 안의 연속된 JSX 태그·속성과 TypeScript 제네릭을 구분해요', () => {
  const code = 'function example<T>(value: T) { return <><Button className="save" icon={null}>Save</Button><output>{value}</output></>; }';
  const lines = highlightCode(code, 'tsx');
  const tokens = lines.flat();
  assert.equal(sourceOf(lines), code);
  assert.ok(tokens.some(token => token.text === 'className' && token.className.includes('attr-name')));
  assert.ok(tokens.some(token => token.text === 'Button' && token.className.includes('class-name')));
  assert.ok(tokens.some(token => token.text === 'null' && token.className === 'token keyword'));
  assert.ok(!tokens.some(token => token.text === 'T' && token.className.includes('tag')));
});

test('문서 코드 펜스의 언어를 보존하고 언어 없는 구조도는 일반 텍스트로 표시해요', () => {
  const blocks = parseDocument('## 예시\n```css\n.button { color: red; }\n```\n```\nRoot\n└── Label\n```');
  assert.deepEqual(blocks.filter(block => block.type === 'code').map(block => block.language), ['css', 'text']);
  assert.ok(highlightCode(blocks[1].text, blocks[1].language).flat().some(token => token.className.includes('property')));
});
