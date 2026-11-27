import type { DocAssembly } from '../data/docAssemblies';
import './DocComposition.css';

/** 부품 카드는 조립 관계를 보여주며 실제 동작하는 컨트롤처럼 표시하지 않아요. */
export function DocComposition({ assembly }: { assembly: DocAssembly }) {
  return <figure aria-label={`${assembly.name} 조립 구성`} className="doc-composition">
    <figcaption className="doc-composition__caption">
      <strong>{assembly.name}</strong>
      <span className="doc-composition__mode">{assembly.mode === 'manual' ? '직접 조립' : '자동 구성'}</span>
    </figcaption>
    <ul className="doc-composition__parts" role="list">
      {assembly.parts.map(part => <li className="doc-composition__part" key={part.name}>
        <div aria-hidden="true" className="doc-composition__visual" data-visual={part.visual}><span /><span /><span /></div>
        <div className="doc-composition__labels">
          {part.optional ? <span>선택</span> : null}
          {part.quantity ? <span>{part.quantity}</span> : null}
          {part.internalName ? <span>내부 전용</span> : null}
        </div>
        <strong className="doc-composition__name">{part.name}</strong>
        <p>{part.role}</p>
        {part.source && assembly.mode === 'automatic' ? <div className="doc-composition__source"><code>{part.source}</code><span>에서 자동 생성</span></div> : null}
        {part.internal ? <div className="doc-composition__internal">
          <span>내부에서 자동 구성</span>
          <strong>{part.internal}</strong>
          {part.source ? <span><code>{part.source}</code>로 하위 메뉴 추가</span> : null}
        </div> : null}
      </li>)}
    </ul>
  </figure>;
}
