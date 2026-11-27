import './DividerDocPreviews.css';
import { Divider } from '../../../../shared/ui/divider';

export function DividerBasicPreview() {
  return (
    <div className="docs-demo__narrow docs-demo__divider"><p>기본 정보</p><Divider /><p>알림 설정</p></div>
  );
}

