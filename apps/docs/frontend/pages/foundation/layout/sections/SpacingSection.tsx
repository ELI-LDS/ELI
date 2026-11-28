import type { LayoutToken } from '../layout.types';
import { FoundationSection } from '../../common/FoundationSection';
import { layoutSections } from '../data/getLayoutData';

/** 같은 콘텐츠에 다른 여백을 적용해 토큰의 실제 크기를 비교해요. */
export function SpacingSection({ scale }: { scale: LayoutToken[] }) {
  const samples = scale.filter(token => [2, 4, 6].some(step => token.label === `Scale/${step}`));
  return <FoundationSection {...layoutSections.spacing} description={<p>같은 콘텐츠에 서로 다른 <code>padding</code>과 <code>gap</code>을 적용해 비교해요.</p>}>
    <div className="foundation-spacing-group">
      <h3 className="foundation-subtitle eli-typo-label-large" id={layoutSections.padding.id} tabIndex={-1}>{layoutSections.padding.title}</h3>
      <div className="foundation-spacing foundation-demo">
        {samples.map(token => <figure key={token.name}>
          <div className="foundation-spacing__padding" style={{ padding: `var(${token.name})` }}><span className="eli-typo-body-small">콘텐츠</span></div>
          <figcaption className="eli-typo-body-small">{token.label} · {token.value}</figcaption>
        </figure>)}
      </div>
    </div>
    <div className="foundation-spacing-group">
      <h3 className="foundation-subtitle eli-typo-label-large" id={layoutSections.gap.id} tabIndex={-1}>{layoutSections.gap.title}</h3>
      <div className="foundation-spacing foundation-demo">
        {samples.map(token => <figure key={token.name}>
          <div className="foundation-spacing__gap"><div style={{ gap: `var(${token.name})` }}><span className="eli-typo-body-small">요소 A</span><span className="eli-typo-body-small">요소 B</span></div></div>
          <figcaption className="eli-typo-body-small">{token.label} · {token.value}</figcaption>
        </figure>)}
      </div>
    </div>
  </FoundationSection>;
}
