import { DocPreviewCase } from '../../sections/DocPreviewCase';
import { ProgressIndicator } from '../../../../shared/ui/progress-indicator';

export function ProgressIndicatorBasicPreview() {
  return (
    <div className="docs-demo__narrow"><ProgressIndicator aria-label="파일 업로드" progress={30} /></div>
  );
}

export function ProgressIndicatorIndeterminatePreview() {
  return (
    <div className="docs-demo__narrow"><DocPreviewCase fullWidth value="undefined"><ProgressIndicator aria-label="업로드 준비 중" /></DocPreviewCase></div>
  );
}

