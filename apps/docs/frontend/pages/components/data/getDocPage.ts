import { getComponent, getProps } from '../../../../content/query.ts';
import { componentPages } from '../../../features/docs-catalog/catalog.ts';
import { docExamples } from './docExamples.ts';
import { componentParts } from './componentParts.ts';
import { getDocAssembly } from './docAssemblies.ts';
import { docSections, exampleAnchor } from './docPage.types.ts';
import type { DocExampleDefinition, DocHeading } from './docPage.types.ts';

/** 사용 기준·하위 API를 같은 조회 계층에서 읽고 웹 구역으로만 분류해요. */
function readGuide(id: string) {
  const component = getComponent({ name: id, sections: ['summary', 'when-to-use', 'variants', 'do-dont', 'accessibility'] });
  const api = getProps({ name: id });
  if ('error' in component || 'error' in api || component.status !== 'stable') return null;
  const sections = component.sections;
  const choicePattern = /^\*\*선택 기준\*\*\n[\s\S]*?(?=\n\n\*\*|$)/;
  const choices = sections.variants?.match(choicePattern)?.[0] ?? '';
  const content = sections['do-dont']?.replace(/^\*\*피해요\*\*\n[\s\S]*?(?=\n\n\*\*|$)/, '').trim();
  const details = [sections.variants?.replace(choicePattern, '').trim(), content].filter(Boolean).join('\n\n');
  // 구성 요소의 사용 권장은 역할 소개로 대신하고 금지·선택 제약은 API 옆에 남겨요.
  const cautions = sections['when-to-use']?.replace(/^\*\*이럴 때 써요\*\*\n[\s\S]*?(?=\n\n\*\*|$)/, '').trim().replace('**이럴 때는 쓰지 않아요**', '**주의사항**');
  return {
    id, name: component.name, entry: component.entry, api,
    summary: sections.summary?.split('**구조**')[0]?.trim() ?? '',
    guidance: [sections['when-to-use'], choices].filter(Boolean).join('\n\n'),
    details,
    composition: [cautions, choices, details].filter(Boolean).join('\n\n'),
    accessibility: sections.accessibility ?? '',
  };
}

/** 모든 페이지가 같은 블록을 사용하며 예시·배치 데이터는 문서 원본에 복제하지 않아요. */
export function getDocPage(id: string) {
  const page = componentPages.find(item => item.id === id);
  if (!page) return null;
  const guide = readGuide(page.id);
  if (!guide) return null;
  const related = (componentParts[page.id] ?? []).map(part => {
    const guide = readGuide(part.id);
    return guide ? { ...guide, isPart: part.kind === 'part' } : null;
  });
  if (related.some(item => !item)) return null;
  const parts = related.filter((item): item is NonNullable<typeof item> => item !== null);
  const guidanceItems = [guide, ...parts.filter(part => !part.isPart)];
  const cases: readonly DocExampleDefinition[] = docExamples[page.id];
  if (cases.slice(1).some(example => !example.section)) throw new Error(`${guide.name}: 예시 구역을 지정해주세요.`);
  const exampleGroups = [docSections.properties, docSections.interactions, docSections.examples].flatMap(section => {
    const examples = cases.slice(1).filter(example => (example.section ?? 'examples') === section.id).map(example => {
      if (section.id !== 'examples' && !example.property) throw new Error(`${guide.name}: 연결할 실제 속성을 지정해주세요.`);
      const api = example.component ? getProps({ name: example.component }) : guide.api;
      if ('error' in api) throw new Error(`${example.component} 컴포넌트를 찾을 수 없어요.`);
      const names = example.property ? [example.property, ...(example.relatedProperties ?? [])] : [];
      const props = names.map(name => {
        const prop = api.props.find(prop => prop.name === name);
        if (!prop) throw new Error(`${api.name}: ${name} 속성을 찾을 수 없어요.`);
        return prop;
      });
      const prop = props[0];
      return { ...example, title: props.length ? props.map(prop => prop.name).join(' · ') : example.title, propertyOwner: example.component ? api.name : null, propertyInfo: prop ? { name: prop.name, required: prop.required === true, default: prop.default } : null };
    });
    return examples.length ? [{ ...section, examples, children: examples.map(example => ({ id: exampleAnchor(example), title: example.title })) }] : [];
  });
  const referenceHeading = docSections.api;
  const assembly = getDocAssembly(page.id);
  const headings: DocHeading[] = [
    docSections.usage,
    ...(assembly ? [docSections.composition] : []),
    docSections.installation,
    ...exampleGroups.map(({ id, title, children }) => ({ id, title, children })),
    ...(guidanceItems.some(item => item.guidance || item.details) ? [docSections.guidelines] : []),
    { ...referenceHeading, ...(parts.length ? { children: [guide, ...parts].map(item => ({ id: `api-${item.id}`, title: item.name })) } : {}) },
    ...([guide, ...parts].some(item => item.accessibility) ? [docSections.accessibility] : []),
  ];
  return {
    ...guide, id: page.id, related: parts, guidanceItems, assembly, exampleGroups, referenceHeading, headings, hasToc: headings.length > 1,
    mobileOnly: 'mobileOnly' in page && page.mobileOnly,
    importCode: [`import { ${guide.name} } from './components/ui/${guide.entry.path.replace(/\.tsx$/, '')}';`, ...(cases[0]?.imports ?? [])].join('\n'),
    installationIds: cases[0]?.install ?? [page.id],
    installationStatus: cases[0]?.installStatus ?? 'current',
    examples: cases,
  };
}
export type DocPage = NonNullable<ReturnType<typeof getDocPage>>;
