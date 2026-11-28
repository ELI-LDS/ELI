import { parseGuidance } from '../data/parseGuidance';
import { docInline } from './DocInline';
import { DocumentContent } from './DocumentContent';

/** 승인된 문구를 유지하면서 사용 상황과 실제 속성 조합의 읽는 순서를 나눠요. */
export function DocGuidance({ markdown, headingLevel = 3 }: { markdown: string; headingLevel?: 3 | 4 }) {
  const Heading = headingLevel === 4 ? 'h4' : 'h3';
  return <div className="doc-guidance">
    {parseGuidance(markdown).map((group, index) => <section aria-label={group.title ?? '사용 안내'} className={group.choices ? 'doc-guidance__choices' : 'doc-guidance__usage'} data-kind={group.title === '선택 기준' ? 'choices' : 'usage'} key={index}>
      {group.title ? <Heading className="eli-typo-label-large">{group.title}</Heading> : null}
      {group.choices ? <dl>{group.choices.map((choice, choiceIndex) => <div className="doc-guidance__choice" key={choiceIndex}>
        <dt>{choice.role}</dt>
        <dd><p>{docInline(choice.when)}</p><div className="doc-guidance__props" aria-label="선택할 속성">{docInline(choice.props)}</div></dd>
      </div>)}</dl> : <div className="doc-prose"><DocumentContent blocks={group.blocks} /></div>}
    </section>)}
  </div>;
}
