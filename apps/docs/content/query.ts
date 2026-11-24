// 페이지·API·MCP가 함께 쓰는 조회 계층이에요. 필터 규칙은 여기 한 곳에서 관리해요.
// 응답에는 요청한 부분만 담아요. 형식은 Agent/mcp-spec.md를 따라요.
import { content } from './generated/data.ts';
import { GUIDE_STATUSES, PROP_FIELDS, SECTION_KEYS, TOKEN_CATEGORIES } from './schema.ts';
import type { Component, PropField, SectionKey, TokenCategory } from './schema.ts';

export interface QueryError {
  error: { code: 'not_found' | 'invalid_argument'; message: string; allowed: string[] };
}

const fail = (code: QueryError['error']['code'], message: string, allowed: readonly string[]): QueryError => ({ error: { code, message, allowed: [...allowed] } });
const normalize = (value: string) => value.toLowerCase().replace(/[\s_-]/g, '');

/** 허용 목록에 없는 값을 찾아요. 대소문자는 구분하지 않고 정식 표기로 돌려줘요. */
function pick<T extends string>(values: readonly string[], allowed: readonly T[], label: string): T[] | QueryError {
  const picked: T[] = [];
  for (const value of values) {
    const found = allowed.find(item => normalize(item) === normalize(value));
    if (!found) return fail('invalid_argument', `${label} '${value}'은(는) 쓸 수 없어요.`, allowed);
    if (!picked.includes(found)) picked.push(found);
  }
  return picked;
}

function findComponent(name: string): Component | QueryError {
  const key = normalize(name);
  const found = content.components.find(component => normalize(component.name) === key);
  if (found) return found;
  const names = content.components.map(component => component.name);
  const similar = names.filter(item => normalize(item).includes(key) || key.includes(normalize(item)) || (key.length >= 3 && normalize(item).startsWith(key.slice(0, 3))));
  return fail('not_found', `컴포넌트 '${name}'을(를) 찾을 수 없어요.`, similar.length ? similar.slice(0, 5) : names);
}

export function listComponents({ status }: { status?: string | undefined } = {}) {
  const picked = status === undefined ? undefined : pick([status], GUIDE_STATUSES, '상태');
  if (picked && 'error' in picked) return picked;
  // 가이드가 검토 전(draft)이거나 없는(null) 컴포넌트도 목록에 나와요. 에이전트가 status로 구분해요.
  return { components: content.components.filter(component => !picked || component.status === picked[0]).map(({ name, id, status, description }) => ({ name, id, status, description })) };
}

export function getComponent({ name, sections = ['summary', 'when-to-use'] }: { name: string; sections?: string[] | undefined }) {
  const component = findComponent(name);
  if ('error' in component) return component;
  const keys = pick(sections, SECTION_KEYS, '섹션');
  if ('error' in keys) return keys;
  const picked: Partial<Record<SectionKey, string>> = {};
  for (const key of keys) {
    const text = component.sections[key];
    if (text !== undefined) picked[key] = text;
  }
  return { name: component.name, id: component.id, status: component.status, entry: component.entry, sections: picked, available: SECTION_KEYS.filter(key => key in component.sections) };
}

export function getProps({ name, names, fields = PROP_FIELDS }: { name: string; names?: string[] | undefined; fields?: readonly string[] | undefined }) {
  const component = findComponent(name);
  if ('error' in component) return component;
  const wanted = names && pick(names, component.props.map(prop => prop.name), 'prop');
  if (wanted && 'error' in wanted) return wanted;
  const keys = pick(fields, PROP_FIELDS, '필드');
  if ('error' in keys) return keys;
  const props = component.props
    .filter(prop => !wanted || wanted.includes(prop.name))
    .map(prop => ({ name: prop.name, ...(Object.fromEntries(keys.map(key => [key, prop[key]])) as Partial<Record<PropField, string | boolean | null>>) }));
  return { name: component.name, props, extends: component.extends };
}

export function getTokens({ category, group, q }: { category?: string | undefined; group?: string | undefined; q?: string | undefined } = {}) {
  // 분류를 생략하면 값 없이 구역 이름만 줘서, 필요한 구역만 다시 요청하게 해요.
  if (!category) {
    return { categories: TOKEN_CATEGORIES.map(key => ({ category: key, groups: content.tokens[key].map(item => ({ group: item.group, count: Object.keys(item.tokens).length })) })) };
  }
  const picked = pick([category], TOKEN_CATEGORIES, '분류');
  if ('error' in picked) return picked;
  const key = picked[0] as TokenCategory;
  let groups = content.tokens[key];
  if (group) {
    groups = groups.filter(item => item.group?.toLowerCase() === group.toLowerCase());
    if (!groups.length) return fail('invalid_argument', `구역 '${group}'은(는) ${key}에 없어요.`, content.tokens[key].flatMap(item => item.group ?? []));
  }
  if (q) {
    const word = q.toLowerCase();
    groups = groups.map(item => ({ group: item.group, tokens: Object.fromEntries(Object.entries(item.tokens).filter(([name]) => name.includes(word))) })).filter(item => Object.keys(item.tokens).length);
  }
  return { category: key, groups };
}

export function getGuide({ topic }: { topic?: string | undefined } = {}) {
  if (!topic) return { guides: content.guides.map(({ topic, title, description }) => ({ topic, title, description })) };
  const guide = content.guides.find(item => item.topic === topic.toLowerCase());
  return guide ?? fail('not_found', `가이드 '${topic}'을(를) 찾을 수 없어요.`, content.guides.map(item => item.topic));
}

export function getVersions() {
  return { ui: { latest: content.version, docs: content.version }, harness: { minimum: content.harnessMinimum } };
}

export function search({ q, limit = 5 }: { q: string; limit?: number | undefined }) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (q.trim().length < 2 || q.length > 100) return fail('invalid_argument', 'q는 2자 이상 100자 이하로 써요.', []);
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) return fail('invalid_argument', 'limit은 1 이상 20 이하의 정수로 써요.', []);

  // 필드 순서가 곧 순위예요: 이름, 설명, 본문.
  const documents = [
    ...content.components.map(component => ({
      id: component.name,
      kind: 'component' as const,
      title: component.name,
      fields: [[null, component.name], [null, component.description], ...Object.entries(component.sections)] as [string | null, string][],
    })),
    ...content.guides.map(guide => ({ id: guide.topic, kind: 'guide' as const, title: guide.title, fields: [[null, guide.title], [null, guide.description], [null, guide.body]] as [string | null, string][] })),
  ];
  const results = [];
  for (const document of documents) {
    const texts = document.fields.map(([, text]) => text.toLowerCase());
    if (!words.every(word => texts.some(text => text.includes(word)))) continue;
    const index = texts.findIndex(text => words.some(word => text.includes(word)));
    const [section, text] = document.fields[index] as [string | null, string];
    const at = Math.min(...words.map(word => (texts[index] as string).indexOf(word)).filter(position => position >= 0));
    const start = Math.max(0, at - 60);
    results.push({ rank: Math.min(index, 2), id: document.id, kind: document.kind, title: document.title, section, excerpt: text.slice(start, start + 200) });
  }
  return { results: results.sort((a, b) => a.rank - b.rank).slice(0, limit).map(({ id, kind, title, section, excerpt }) => ({ id, kind, title, section, excerpt })) };
}
