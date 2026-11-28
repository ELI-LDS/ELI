import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const alertDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "유지해서 보여줄 안내를 제목과 본문으로 전달해요.",
    code: `<Alert title="안내를 확인해주세요." message="변경사항을 저장하기 전에 내용을 확인해요." />`,
  },
  {
    id: "statuses", section: 'properties', property: 'status',
    title: "의미별 상태",
    description: "내용의 의미에 맞춰 `info`·`success`·`caution`·`error`를 선택해요.",
    code: `<Alert status="info" title="안내" />
<Alert status="success" title="완료" />
<Alert status="caution" title="주의" />
<Alert status="error" title="오류" />`,
    fullCode: `import { Alert } from './components/ui/alert';

export default function Example() {
  const labels = { info: "안내", success: "완료", caution: "주의", error: "오류" } as const;
  return (
    <div>{(["info", "success", "caution", "error"] as const).map(status => <Alert key={status} status={status} title={labels[status]} message="안내 내용을 확인해주세요." />)}</div>
  );
}`,
  },
] as const satisfies readonly DocExampleDefinition[];
