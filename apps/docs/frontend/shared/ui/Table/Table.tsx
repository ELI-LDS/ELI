import './Table.css';
import '../../styles/site';
import type { TableProps } from './Table.types';

/* Figma의 672px 기준 열 너비를 비율로 적용해 넓은 문서 영역에서도 균형을 유지해요. */
const columnWidths: Readonly<Record<number, readonly number[]>> = {
  2: [188, 484], 3: [150, 210, 312], 4: [120, 158, 106, 288],
  5: [100, 106, 120, 128, 218], 6: [104, 90, 90, 90, 90, 208],
};

/** 좁은 화면에서도 열을 분리하지 않고 표 전체를 함께 스크롤해요. */
export function Table({ caption, columns, rows, className, style }: TableProps) {
  const widths = columnWidths[columns.length];
  return (
    <div aria-label={`${caption} 스크롤 영역`} className={['docs-table-scroll', className].filter(Boolean).join(' ')} role="region" style={style} tabIndex={0}>
      <table className="docs-table eli-typo-body-small">
        <caption className="docs-sr-only">{caption}</caption>
        <colgroup>
          {columns.map((column, index) => (
            <col key={column.key} style={{ width: column.width ?? `${((widths?.[index] ?? 672 / columns.length) / 672) * 100}%` }} />
          ))}
        </colgroup>
        <thead><tr>{columns.map(column => <th key={column.key} scope="col">{column.label}</th>)}</tr></thead>
        <tbody>
          {rows.map(row => <tr key={row.id}>{columns.map(column => <td key={column.key}>{row.cells[column.key]}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}
