import { DocPreviewCase } from '../../sections/DocPreviewCase';
import { Fab } from '../../../../shared/ui/fab';
import { FabMenu } from '../../../../shared/ui/fab-menu';

export function FabBasicPreview() {
  return (
    <Fab label="새 글 작성" />
  );
}

export function FabIconPreview() {
  return (
    <DocPreviewCase value="false"><Fab showLabel={false} aria-label="새 글 작성" /></DocPreviewCase>
  );
}

export function FabMenuPreview() {
  const items = [{ id: "photo", label: "사진 추가" }, { id: "file", label: "파일 추가" }];
  return (
    <div className="docs-demo__fab-menu"><FabMenu label="추가" items={items} /></div>
  );
}

