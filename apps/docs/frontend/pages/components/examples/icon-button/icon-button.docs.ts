import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const iconButtonDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "아이콘만 표시하는 버튼에는 **동작을 설명하는** `aria-label`이 필요해요.",
    code: `<IconButton aria-label="항목 추가" />`,
  },
  {
    id: "variants", section: 'properties', property: 'variant', relatedProperties: ['color'],
    title: "형태와 색상",
    description: "`solid`·`outline`과 `brand`·`neutral`을 조합해요.",
    code: `<IconButton aria-label="브랜드 채움 추가" color="brand" variant="solid" /><IconButton aria-label="브랜드 테두리 추가" color="brand" variant="outline" /><IconButton aria-label="중립 채움 추가" color="neutral" variant="solid" /><IconButton aria-label="중립 테두리 추가" color="neutral" variant="outline" />`,
  },
  {
    id: "disabled", section: 'interactions', property: 'disabled',
    title: "비활성화",
    description: "`disabled`를 전달하면 실행할 수 없어요.",
    code: `<IconButton aria-label="항목 추가" disabled />`,
  },
] as const satisfies readonly DocExampleDefinition[];
