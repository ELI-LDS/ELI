import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const progressIndicatorDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "작업에서 받은 실제 진행률을 `progress`에 전달해요.",
    code: `<ProgressIndicator aria-label="파일 업로드" progress={30} />`,
  },
  {
    id: "indeterminate", section: 'properties', property: 'progress',
    title: "진행률을 모르는 경우",
    description: "진행률을 계산할 수 없으면 `progress`를 생략해요.",
    code: `<ProgressIndicator aria-label="업로드 준비 중" />`,
  },
] as const satisfies readonly DocExampleDefinition[];
