import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const fabDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "하나의 주요 행동을 라벨과 함께 표시해요.",
    install: ["fab"],
    installStatus: 'planned',
    code: `<Fab label="새 글 작성" />`,
  },
  {
    id: "icon", section: 'properties', property: 'showLabel',
    title: "아이콘만 표시",
    description: "라벨을 숨길 때도 `aria-label`로 동작을 설명해요.",
    code: `<Fab showLabel={false} aria-label="새 글 작성" />`,
  },
  {
    id: "menu", section: 'interactions', property: 'items', component: 'fab-menu',
    title: "여러 행동 펼치기",
    description: "관련된 여러 행동은 `FabMenu`의 `items`로 전달해요. 실행할 기능은 `items`의 `onClick`에 연결하고, 항목을 누르면 메뉴가 닫혀요.",
    code: `<FabMenu label="추가" items={items} />`,
    fullCode: `import { FabMenu } from './components/ui/fab-menu';

export default function Example() {
  const items = [{ id: "photo", label: "사진 추가" }, { id: "file", label: "파일 추가" }];
  return (
    <div><FabMenu label="추가" items={items} /></div>
  );
}`,
  },
] as const satisfies readonly DocExampleDefinition[];
