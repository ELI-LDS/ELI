import { foundationLinks } from './navigation.ts';
import { componentPages, componentRouteAliases } from './catalog.ts';

const normalize = (text: string) => text.toLowerCase().replace(/[\s-]/g, '');
const groupedNames: Record<string, string> = {
  chip: 'FilterChip RemovableChip 필터 칩 리무버블 칩',
  fab: 'FabMenu FabMenuSegment 플로팅 액션 버튼 메뉴',
  'navigation-bar': 'NavigationBarGlass NavigationBarItem NavigationBarGlassItem 글래스',
  'drawer': 'NavigationDrawerMenu NavigationDrawerItem NavigationDrawerCategory',
};
const entries = [
  ...foundationLinks.map(link => ({ label: link.label, href: link.value, aliases: link.label === 'Color' ? '색상 컬러' : link.label === 'Typography' ? '타이포그래피 폰트' : '레이아웃' })),
  ...componentPages.map(page => ({ label: page.label, href: `/components/${page.id}`, aliases: page.korean, keywords: [page.id, groupedNames[page.id] ?? '', ...Object.entries(componentRouteAliases).filter(([, id]) => id === page.id).map(([old]) => old)].join(' ') })),
];

/** 문서 경로와 한글·하위 컴포넌트 이름을 같은 목록에서 검색해요. */
export function searchDocuments(query: string) {
  const key = normalize(query.trim());
  return key ? entries.filter(entry => normalize(`${entry.label} ${entry.aliases} ${'keywords' in entry ? entry.keywords : ''}`).includes(key)) : [];
}
