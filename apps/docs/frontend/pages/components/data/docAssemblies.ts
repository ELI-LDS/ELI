import { getProps } from '../../../../content/query.ts';
import type { ComponentId } from '../../../features/docs-catalog/catalog.ts';

type Part = {
  id?: string;
  internalName?: string;
  role: string;
  visual: 'category' | 'menu' | 'item' | 'button' | 'dim';
  optional?: boolean;
  quantity?: string;
  source?: string;
  internal?: string;
};

type Assembly = {
  root: string;
  mode: 'manual' | 'automatic';
  parts: readonly Part[];
};

/** 화면 조립 관계를 설명해요. 설치 의존성이나 DOM 트리를 대신하지 않아요. */
const assemblies: Partial<Record<ComponentId, Assembly>> = {
  'navigation-drawer': {
    root: 'navigation-drawer', mode: 'manual',
    parts: [
      { id: 'navigation-drawer-category', role: '메뉴 묶음의 이름', visual: 'category', optional: true },
      { id: 'navigation-drawer-menu', role: '주 메뉴와 하위 메뉴', visual: 'menu', quantity: '반복 가능', source: 'subItems', internal: 'navigation-drawer-item' },
    ],
  },
  'navigation-bar': {
    root: 'navigation-bar', mode: 'automatic',
    parts: [{ id: 'navigation-bar-item', role: '아이콘과 라벨로 표시하는 목적지', visual: 'item', quantity: '반복 가능', source: 'items' }],
  },
  'navigation-bar-glass': {
    root: 'navigation-bar-glass', mode: 'automatic',
    parts: [{ id: 'navigation-bar-glass-item', role: '아이콘으로 표시하는 목적지', visual: 'item', quantity: '반복 가능', source: 'items' }],
  },
  fab: {
    root: 'fab-menu', mode: 'automatic',
    parts: [
      { id: 'fab', role: '메뉴를 여닫는 메인 버튼', visual: 'button' },
      { id: 'fab-menu-segment', role: '펼쳐지는 개별 액션', visual: 'menu', quantity: '반복 가능', source: 'items' },
    ],
  },
  select: {
    root: 'select', mode: 'automatic',
    parts: [{ id: 'menu-item', role: '선택할 수 있는 옵션', visual: 'menu', quantity: '반복 가능', source: 'options' }],
  },
  modal: {
    root: 'modal', mode: 'automatic',
    parts: [
      { internalName: 'Dim', role: '배경을 덮는 내부 요소', visual: 'dim' },
      { id: 'button', role: 'Secondary·Positive 동작', visual: 'button', quantity: '2개' },
    ],
  },
};

function componentName(id: string) {
  const api = getProps({ name: id });
  if ('error' in api) throw new Error(`구성도에 없는 컴포넌트를 참조했어요: ${id}`);
  return api.name;
}

export function getDocAssembly(id: ComponentId) {
  const assembly = assemblies[id];
  if (!assembly) return null;
  return {
    name: componentName(assembly.root), mode: assembly.mode,
    parts: assembly.parts.map(part => ({
      ...part,
      name: part.id ? componentName(part.id) : part.internalName!,
      internal: part.internal ? componentName(part.internal) : null,
    })),
  };
}

export type DocAssembly = NonNullable<ReturnType<typeof getDocAssembly>>;
