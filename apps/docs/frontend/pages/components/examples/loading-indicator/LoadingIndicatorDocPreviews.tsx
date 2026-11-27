import { DocPreviewCase } from '../../sections/DocPreviewCase';
import { LoadingIndicator } from '../../../../shared/ui/loading-indicator';

export function LoadingIndicatorBasicPreview() {
  return (
    <LoadingIndicator aria-label="콘텐츠를 불러오는 중" />
  );
}

export function LoadingIndicatorProgressPreview() {
  return (
    <DocPreviewCase value="30"><LoadingIndicator aria-label="파일 업로드" progress={30} /></DocPreviewCase>
  );
}

export function LoadingIndicatorCyclePreview() {
  return (
    <div className="docs-demo__row"><DocPreviewCase value="continuous"><LoadingIndicator aria-label="연속 회전" variant="continuous" /></DocPreviewCase><DocPreviewCase value="cycle"><LoadingIndicator aria-label="2초 반복" variant="cycle" /></DocPreviewCase></div>
  );
}

