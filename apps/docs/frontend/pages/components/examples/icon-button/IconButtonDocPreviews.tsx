import { DocPreviewCase } from '../../sections/DocPreviewCase';
import { IconButton } from '../../../../shared/ui/icon-button';

export function IconButtonBasicPreview() {
  return (
    <IconButton aria-label="항목 추가" />
  );
}

export function IconButtonVariantsPreview() {
  return (
    <div className="docs-demo__row"><DocPreviewCase value="brand · solid"><IconButton aria-label="브랜드 채움 추가" color="brand" variant="solid" /></DocPreviewCase><DocPreviewCase value="brand · outline"><IconButton aria-label="브랜드 테두리 추가" color="brand" variant="outline" /></DocPreviewCase><DocPreviewCase value="neutral · solid"><IconButton aria-label="중립 채움 추가" color="neutral" variant="solid" /></DocPreviewCase><DocPreviewCase value="neutral · outline"><IconButton aria-label="중립 테두리 추가" color="neutral" variant="outline" /></DocPreviewCase></div>
  );
}

export function IconButtonDisabledPreview() {
  return (
    <IconButton aria-label="항목 추가" disabled />
  );
}

