import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const segmentControlDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "연관된 보기 방식 중 하나를 선택해요.",
    code: `<SegmentControl aria-label="보기 방식" options={[{ value: "list", label: "목록" }, { value: "grid", label: "격자" }]} />`,
  },
  {
    id: "controlled", section: 'interactions', property: 'value', relatedProperties: ['onValueChange'],
    title: "선택값 연결",
    description: "`value`·`onValueChange`로 선택한 보기 방식을 기능에 연결해요.",
    code: `<SegmentControl aria-label="보기 방식" options={[{ value: "list", label: "목록" }, { value: "grid", label: "격자" }]} value={view} onValueChange={setView} />`,
    fullCode: `import { useState } from 'react';
import { SegmentControl } from './components/ui/segment-control';

export default function Example() {
  const [view, setView] = useState("list");
  return (
    <SegmentControl aria-label="보기 방식" options={[{ value: "list", label: "목록" }, { value: "grid", label: "격자" }]} value={view} onValueChange={setView} />
  );
}`,
  },
  {
    id: "disabled", section: 'interactions', property: 'disabled',
    title: "비활성화",
    description: "전체 선택을 막을 때 `disabled`를 전달해요.",
    code: `<SegmentControl aria-label="변경할 수 없는 보기 방식" options={[{ value: "list", label: "목록" }, { value: "grid", label: "격자" }]} disabled />`,
  },
] as const satisfies readonly DocExampleDefinition[];
