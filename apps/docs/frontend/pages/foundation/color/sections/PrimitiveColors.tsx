import type { PaletteGroup } from '../color.types';
import { FoundationSection } from '../../common/FoundationSection';
import { colorSectionId } from '../data/colorHeadings';

/** 값은 공통 조회 계층에서 받고 페이지에는 별도 색상 팔레트를 정의하지 않아요. */
export function PrimitiveColors({ groups }: { groups: PaletteGroup[] }) {
  return <div className="foundation-color-sections">{groups.map(group => (
    <FoundationSection id={colorSectionId('primitive', group.name)} key={group.name} title={group.name}>
      <div className="foundation-palette">
        {group.tokens.map(token => <div className="foundation-palette__chip" key={token.name}>
          <div className="foundation-palette__color" data-white={token.value.toLowerCase() === '#ffffff'} style={{ backgroundColor: `var(${token.name})` }} />
          <div className="foundation-palette__details eli-typo-body-small"><p>{token.label}</p><p>{token.value.toUpperCase()}</p></div>
        </div>)}
      </div>
    </FoundationSection>
  ))}</div>;
}
