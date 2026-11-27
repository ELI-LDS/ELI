import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const navigationBarDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "기본·활성 상태의 아이콘을 각각 전달해요. **활성 항목에서만** 채운 아이콘을 사용해요.",
    code: `<NavigationBar aria-label="주요 화면" items={items} />`,
    fullCode: `import { NavigationBar } from './components/ui/navigation-bar';

export default function Example() {
  const items = ['홈', '검색', '내 정보'].map((label, index) => ({
    value: String(index), label,
    outlinedIcon: <span aria-hidden="true">○</span>,
    filledIcon: <span aria-hidden="true">●</span>,
  }));
  return (
    <NavigationBar aria-label="주요 화면" items={items} />
  );
}`,
  },
  {
    id: "controlled", section: 'interactions', property: 'value', relatedProperties: ['onValueChange'],
    title: "선택한 화면 연결",
    description: "`value`와 `onValueChange`를 연결해 현재 목적지를 관리해요. 실제 페이지 이동은 소비 앱에서 연결해요.",
    code: `<NavigationBar aria-label="주요 화면" items={items} value={page} onValueChange={setPage} />`,
    fullCode: `import { useState } from 'react';
import { NavigationBar } from './components/ui/navigation-bar';

export default function Example() {
  const [page, setPage] = useState("0");
  const items = ['홈', '검색', '내 정보'].map((label, index) => ({
    value: String(index), label,
    outlinedIcon: <span aria-hidden="true">○</span>,
    filledIcon: <span aria-hidden="true">●</span>,
  }));
  return (
    <NavigationBar aria-label="주요 화면" items={items} value={page} onValueChange={setPage} />
  );
}`,
  },
] as const satisfies readonly DocExampleDefinition[];
