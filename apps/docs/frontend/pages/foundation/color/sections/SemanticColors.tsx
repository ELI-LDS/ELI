import { Table } from '../../../../shared/ui/Table/Table';
import type { SemanticGroup } from '../color.types';
import { FoundationSection } from '../../common/FoundationSection';
import { colorSectionId } from '../data/colorHeadings';

const columns = [
  { key: 'token', label: 'Token', width: 'var(--docs-semantic-token-width)' },
  { key: 'description', label: 'Role / Description', width: 'auto' },
  { key: 'value', label: 'Value', width: '178px' },
];

/** 표 전체를 스크롤하며 토큰 이름·설명·색상 샘플의 열 정렬을 함께 유지해요. */
export function SemanticColors({ groups }: { groups: SemanticGroup[] }) {
  return <div className="foundation-color-sections">{groups.map(group => (
    <FoundationSection id={colorSectionId('semantic', group.name)} key={group.name} title={group.name}>
      <Table caption={`${group.name} 의미 색상`} className="foundation-semantic" columns={columns} rows={group.tokens.map(token => ({
        id: token.name,
        cells: {
          token: token.label,
          description: token.description,
          value: <div className="foundation-semantic__value">
            <span aria-hidden="true" className="foundation-semantic__swatch" style={{ backgroundColor: `var(${token.name})` }} />
            <div><p>{token.reference}</p><p>{token.opacity ? `불투명도 ${token.opacity}` : token.value.toUpperCase()}</p></div>
          </div>,
        },
      }))} />
    </FoundationSection>
  ))}</div>;
}
