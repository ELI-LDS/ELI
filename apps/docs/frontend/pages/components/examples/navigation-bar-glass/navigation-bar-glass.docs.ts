import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const navigationBarGlassDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "모바일용 아이콘 중심 내비게이션이에요. `label`은 화면 낭독기에 전달해요. **활성 항목에서만** 채운 아이콘을 사용해요.",
    code: `<NavigationBarGlass aria-label="주요 화면" items={items} />`,
    fullCode: `import { NavigationBarGlass } from './components/ui/navigation-bar-glass';

export default function Example() {
  const items = ['홈', '검색', '내 정보'].map((label, index) => ({
    value: String(index), label,
    outlinedIcon: <span aria-hidden="true">○</span>,
    filledIcon: <span aria-hidden="true">●</span>,
  }));
  return (
    <NavigationBarGlass aria-label="주요 화면" items={items} />
  );
}`,
  },
  {
    id: "controlled", section: 'interactions', property: 'value', relatedProperties: ['onValueChange'],
    title: "선택한 화면 연결",
    description: "`value`와 `onValueChange`를 연결해 현재 목적지를 관리해요. 실제 페이지 이동은 소비 앱에서 연결해요.",
    code: `<NavigationBarGlass aria-label="주요 화면" items={items} value={page} onValueChange={setPage} />`,
    fullCode: `import { useState } from 'react';
import { NavigationBarGlass } from './components/ui/navigation-bar-glass';

export default function Example() {
  const [page, setPage] = useState("0");
  const items = ['홈', '검색', '내 정보'].map((label, index) => ({
    value: String(index), label,
    outlinedIcon: <span aria-hidden="true">○</span>,
    filledIcon: <span aria-hidden="true">●</span>,
  }));
  return (
    <NavigationBarGlass aria-label="주요 화면" items={items} value={page} onValueChange={setPage} />
  );
}`,
  },
] as const satisfies readonly DocExampleDefinition[];
