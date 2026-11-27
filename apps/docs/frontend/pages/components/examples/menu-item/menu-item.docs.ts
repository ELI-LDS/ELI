import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const menuItemDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "메뉴에서 실행할 행동을 한 줄로 표시해요.",
    code: `<MenuItem>이름 변경</MenuItem>`,
  },
  {
    id: "shortcut", section: 'properties', property: 'shortcut',
    title: "단축키 안내",
    description: "`shortcut`은 단축키 문구를 표시해요. 실제 키보드 실행은 소비 앱에서 연결해요.",
    code: `<MenuItem shortcut="⌘K">검색</MenuItem>`,
  },
  {
    id: "disabled", section: 'interactions', property: 'disabled',
    title: "비활성화",
    description: "실행할 수 없는 항목에는 `disabled`를 전달해요.",
    code: `<MenuItem disabled>이름 변경</MenuItem>`,
  },
] as const satisfies readonly DocExampleDefinition[];
