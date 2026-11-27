import type { TypographyStyle } from '../data/getTypographyData';
import { typographySections } from '../data/typographySections';
import { FoundationSection } from '../../common/FoundationSection';

/** 미리보기와 사양을 같은 스타일 안에 두고 설치한 클래스와 조회 값을 그대로 사용해요. */
export function TypographySection({ group, styles }: { group: keyof typeof typographySections; styles: TypographyStyle[] }) {
  const { sample, description, ...section } = typographySections[group];
  return <FoundationSection {...section} description={<p>{description}</p>}>
    <div className="foundation-type-list">
      {styles.map(style => <figure className="foundation-type-style" data-typography-style={style.name} key={style.name}>
        <figcaption><strong>{style.name}</strong><code>{style.className}</code></figcaption>
        <div aria-label={`${style.name} 미리보기`} className="foundation-type-sample" role="group"><p className={style.className} data-style={style.name}>{sample}</p></div>
        <dl className="foundation-type-metrics">
          <div><dt>font-size <span>Mobile / Desktop</span></dt><dd>{style.size}</dd></div>
          <div><dt>font-weight</dt><dd>{style.weightLabel} · {style.weightValue}</dd></div>
          <div><dt>line-height</dt><dd>{style.lineHeight}</dd></div>
          <div><dt>letter-spacing</dt><dd>{style.spacing}</dd></div>
        </dl>
      </figure>)}
    </div>
  </FoundationSection>;
}
