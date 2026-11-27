import type { ComponentId } from '../../../features/docs-catalog/catalog';

/** 같은 상세 문서에서 소개하는 조립 부품이에요. 설치 의존 그래프와는 구분해요. */
export const componentParts: Partial<Record<ComponentId, readonly { id: string; kind: 'alternative' | 'part' }[]>> = {
  chip: [{ id: 'filter-chip', kind: 'alternative' }, { id: 'removable-chip', kind: 'alternative' }],
  fab: [{ id: 'fab-menu', kind: 'alternative' }, { id: 'fab-menu-segment', kind: 'part' }],
  'navigation-bar': [{ id: 'navigation-bar-item', kind: 'part' }],
  'navigation-bar-glass': [{ id: 'navigation-bar-glass-item', kind: 'part' }],
  'navigation-drawer': [{ id: 'navigation-drawer-menu', kind: 'part' }, { id: 'navigation-drawer-category', kind: 'part' }, { id: 'navigation-drawer-item', kind: 'part' }],
};
