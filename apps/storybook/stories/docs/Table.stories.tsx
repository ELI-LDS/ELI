import { useArgs } from 'storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from '@/apps/docs/frontend/shared/ui/Table/Table';
import type { TableColumn, TableProps, TableRow } from '@/apps/docs/frontend/shared/ui/Table/Table.types';
import { StoryCase, StoryOverview, StoryPreviewLayout } from '../../components/StoryDeviceFrame.js';
import './DocsWebsite.stories.css';

const sampleColumns: TableColumn[] = [
  { key: 'prop', label: '속성' }, { key: 'description', label: '설명' }, { key: 'usage', label: '용도' },
  { key: 'type', label: '타입' }, { key: 'default', label: '기본값' }, { key: 'note', label: '참고' },
];
const sampleRows: TableRow[] = [
  { id: 'value', cells: { prop: 'value', description: '입력값을 지정해요.', usage: '외부에서 입력값을 제어해요.', type: 'string', default: '-', note: '상태와 연결해요.' } },
  { id: 'defaultValue', cells: { prop: 'defaultValue', description: '초기 입력값을 지정해요.', usage: '비제어 방식의 최초 값이에요.', type: 'string', default: '-', note: '초기화에 사용해요.' } },
  { id: 'onChange', cells: { prop: 'onChange', description: '입력값이 변경될 때 실행할 함수를 지정해요.', usage: '입력한 값을 전달받아요.', type: 'function', default: '-', note: '변경 동작을 연결해요.' } },
];
type TableStoryProps = TableProps & { previewWidth: number };
function TablePreview({ previewWidth, ...props }: TableStoryProps) {
  return <div className="docs-web-story__surface" style={{ width: previewWidth }}><Table {...props} /></div>;
}
const meta = {
  title: '문서 웹사이트/Table', component: Table,
  args: { caption: '입력 속성 안내', columns: sampleColumns.slice(0, 2), rows: sampleRows, previewWidth: 672 },
  argTypes: {
    caption: { name: '표 설명', control: 'text', description: '화면 낭독기에서 읽는 표 제목이에요.' },
    columns: { name: '열', control: false, description: '왼쪽 편집 영역에서 추가·수정·삭제해요.' },
    rows: { name: '행', control: false, description: '왼쪽 편집 영역에서 추가·수정·삭제해요.' },
    previewWidth: { name: '미리보기 너비', control: { type: 'range', min: 320, max: 1024, step: 1 } },
  },
  render: args => <TablePreview {...args} />,
} satisfies Meta<TableStoryProps>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  name: '한눈에 보기', parameters: { controls: { disable: true } },
  render: () => <StoryOverview description="좁은 화면에서는 헤더와 본문을 포함한 표 전체를 좌우로 스크롤해요.">
    {[2, 3, 4, 5, 6].map(count => <StoryCase key={count} title={`${count}열`}><TablePreview caption={`${count}열 속성 안내`} columns={sampleColumns.slice(0, count)} rows={sampleRows} previewWidth={672} /></StoryCase>)}
    <StoryCase title="좁은 화면 · 표 전체 스크롤"><TablePreview caption="좁은 화면 표" columns={sampleColumns} rows={sampleRows} previewWidth={375} /></StoryCase>
  </StoryOverview>,
};
export const Playground: Story = {
  name: '직접 바꿔보기',
  render: function Playground(args) {
    const [, updateArgs] = useArgs<TableStoryProps>();
    const { columns, rows } = args;
    return <StoryPreviewLayout editor={(
      <div className="docs-web-story__editor">
        <strong>열 편집</strong>
        {columns.map((column, index) => <fieldset key={column.key}>
          <legend>열 {index + 1}</legend>
          <label>제목<input value={String(column.label)} onChange={event => updateArgs({ columns: columns.map((item, i) => i === index ? { ...item, label: event.currentTarget.value } : item) })} /></label>
          <button type="button" disabled={columns.length <= 2} onClick={() => updateArgs({ columns: columns.filter((_, i) => i !== index) })}>열 삭제</button>
        </fieldset>)}
        <button type="button" disabled={columns.length >= 6} onClick={() => updateArgs({ columns: [...columns, { key: `column-${Date.now()}`, label: '새 열' }] })}>열 추가</button>
        <strong>행 편집</strong>
        {rows.map((row, index) => <fieldset key={row.id}>
          <legend>행 {index + 1}</legend>
          {columns.map(column => <label key={column.key}>{column.label}<input value={String(row.cells[column.key] ?? '')} onChange={event => updateArgs({ rows: rows.map(item => item.id === row.id ? { ...item, cells: { ...item.cells, [column.key]: event.currentTarget.value } } : item) })} /></label>)}
          <button type="button" onClick={() => updateArgs({ rows: rows.filter(item => item.id !== row.id) })}>행 삭제</button>
        </fieldset>)}
        <button type="button" onClick={() => updateArgs({ rows: [...rows, { id: `row-${Date.now()}`, cells: {} }] })}>행 추가</button>
      </div>
    )}><TablePreview {...args} /></StoryPreviewLayout>;
  },
};
