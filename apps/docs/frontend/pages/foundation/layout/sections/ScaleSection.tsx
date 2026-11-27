import type { LayoutToken } from '../layout.types';
import { FoundationSection } from '../../common/FoundationSection';
import { layoutSections } from '../data/getLayoutData';

export function ScaleSection({ scale }: { scale: LayoutToken[] }) {
  return <FoundationSection {...layoutSections.scale} description={<p>4px부터 64px까지 실제 토큰 값과 같은 길이로 비교해요.</p>}>
    <div className="foundation-scale foundation-demo">
      {scale.filter(token => token.number !== 999).map(token => <div className="foundation-scale__row eli-typo-body-small" key={token.name}>
        <span>{token.label}</span><div className="foundation-scale__track"><span className="foundation-scale__bar" style={{ width: `var(${token.name})` }} /></div><span>{token.value}</span>
      </div>)}
    </div>
  </FoundationSection>;
}
