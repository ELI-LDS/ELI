import { docInline as inline } from './DocInline';
import { Table } from '../../../shared/ui/Table/Table';
import { CodeBlock } from '../../../features/code-block/CodeBlock';
import type { DocumentBlock } from '../data/parseDocument';


/** 용도·구조·명세를 서버에서 표시하고 표 전체를 가로로 스크롤하게 해요. */
export function DocumentContent({ blocks }: { blocks: readonly DocumentBlock[] }) {
  return <>
    {blocks.map((block, index) => {
      if (block.type === 'heading') {
        const Tag = block.level === 2 ? 'h2' : block.level === 3 ? 'h3' : 'h4';
        return <Tag key={index}>{inline(block.text)}</Tag>;
      }
      if (block.type === 'list') return <ul key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ul>;
      if (block.type === 'code') return <CodeBlock code={block.text} key={index} label="컴포넌트 구조와 사용 예시" language={block.language} />;
      if (block.type === 'table') return <Table caption={`문서 표 ${index + 1}`} columns={block.headers.map((header, col) => ({ key: String(col), label: inline(header) }))} key={index} rows={block.rows.map((row, rowIndex) => ({ id: String(rowIndex), cells: Object.fromEntries(row.map((cell, col) => [String(col), inline(cell)])) }))} />;
      return <p key={index}>{inline(block.text)}</p>;
    })}
  </>;
}
