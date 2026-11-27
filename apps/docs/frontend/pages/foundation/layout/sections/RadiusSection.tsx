import type { LayoutToken } from '../layout.types';
import { FoundationSection } from '../../common/FoundationSection';
import { layoutSections } from '../data/getLayoutData';

export function RadiusSection({ scale }: { scale: LayoutToken[] }) {
  const radii = scale.filter(token => [1, 2, 3, 4, 6, 999].some(step => token.label === `Scale/${step}`));
  return <FoundationSection {...layoutSections.radius} description={<p>같은 크기의 도형에 다른 <code>border-radius</code>를 적용해 비교해요.</p>}>
    <div className="foundation-radius foundation-demo">{radii.map(token => <figure key={token.name}>
      <div className="foundation-radius__shape" style={{ borderRadius: `var(${token.name})` }} />
      <figcaption className="eli-typo-body-small">{token.label}<br />({token.value})</figcaption>
    </figure>)}</div>
    <p className="eli-typo-body-small">Scale/999는 도형 크기에 맞춰 모서리가 완전히 둥글게 표현돼요. 위 도형은 모두 같은 크기예요.</p>
  </FoundationSection>;
}
