import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const loadingIndicatorDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "진행률을 모르는 작업은 `progress` 없이 표시해요.",
    code: `<LoadingIndicator aria-label="콘텐츠를 불러오는 중" />`,
  },
  {
    id: "progress", section: 'properties', property: 'progress',
    title: "진행률 표시",
    description: "실제 진행률을 알면 `progress`를 전달해요.",
    code: `<LoadingIndicator aria-label="파일 업로드" progress={30} />`,
  },
  {
    id: "cycle", section: 'properties', property: 'variant',
    title: "반복 방식",
    description: "`cycle`은 2초 반복, `continuous`는 연속 회전이에요.",
    code: `<LoadingIndicator aria-label="연속 회전" variant="continuous" /><LoadingIndicator aria-label="2초 반복" variant="cycle" />`,
  },
] as const satisfies readonly DocExampleDefinition[];
