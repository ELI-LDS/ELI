import { Table } from '../../../../shared/ui/Table/Table';
import type { LayoutToken } from '../layout.types';
import { FoundationSection } from '../../common/FoundationSection';
import { layoutSections } from '../data/getLayoutData';

export function TokenReference({ tokens }: { tokens: LayoutToken[] }) {
  return <FoundationSection {...layoutSections.tokens} description={<p>스케일과 뷰포트 기준값을 확인해요. Responsive 값은 간격·모서리 값과 구분해 사용해요.</p>}>
    <Table caption="레이아웃 토큰 기준" columns={[{ key: 'token', label: 'Token', width: '200px' }, { key: 'value', label: 'Value' }]} rows={tokens.map(token => ({ id: token.name, cells: { token: token.label, value: token.number } }))} />
  </FoundationSection>;
}
