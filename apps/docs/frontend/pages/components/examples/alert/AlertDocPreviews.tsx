import { DocPreviewCase } from '../../sections/DocPreviewCase';
import { Alert } from '../../../../shared/ui/alert';

export function AlertBasicPreview() {
  return (
    <Alert title="안내를 확인해주세요." message="변경사항을 저장하기 전에 내용을 확인해요." />
  );
}

export function AlertStatusesPreview() {
  const labels = { info: "안내", success: "완료", caution: "주의", error: "오류" } as const;
  return (
    <div className="docs-demo__stack">{(["info", "success", "caution", "error"] as const).map(status => <DocPreviewCase fullWidth key={status} value={status}><Alert status={status} title={labels[status]} message="안내 내용을 확인해주세요." /></DocPreviewCase>)}</div>
  );
}

