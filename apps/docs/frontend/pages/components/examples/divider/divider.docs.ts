import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const dividerDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "관련된 콘텐츠 묶음 사이에 가로 구분선을 넣어요.",
    code: `<p>기본 정보</p>
<Divider />
<p>알림 설정</p>`,
  },
] as const satisfies readonly DocExampleDefinition[];
