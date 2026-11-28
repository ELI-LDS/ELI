export type DocumentBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; text: string; language: string }
  | { type: 'table'; headers: string[]; rows: string[][] };

/** 원문의 안전한 부분집합만 네이티브 요소로 표시해요. HTML과 스크립트는 실행하지 않아요. */
export function parseDocument(markdown: string): DocumentBlock[] {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const blocks: DocumentBlock[] = [];
  let started = false;
  const cells = (line: string) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(cell => cell.trim().replace(/\\\|/g, '|'));
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]?.trim() ?? '';
    if (!started) { if (/^##\s/.test(line)) started = true; else continue; }
    if (!line || /^---+$/.test(line)) continue;
    const heading = line.match(/^(#{2,6})\s+(.+)$/);
    if (heading) { blocks.push({ type: 'heading', level: heading[1]!.length, text: heading[2]! }); continue; }
    if (line.startsWith('```')) {
      const language = line.slice(3).trim().split(/\s/)[0] || 'text';
      const code: string[] = [];
      while (++index < lines.length && !lines[index]?.trim().startsWith('```')) code.push(lines[index] ?? '');
      blocks.push({ type: 'code', text: code.join('\n'), language }); continue;
    }
    if (line.startsWith('|') && /^\s*\|?[\s:|-]+\|\s*$/.test(lines[index + 1] ?? '')) {
      const headers = cells(line); const rows: string[][] = []; index++;
      while (lines[index + 1]?.trim().startsWith('|')) rows.push(cells(lines[++index] ?? ''));
      blocks.push({ type: 'table', headers, rows }); continue;
    }
    if (/^[-*]\s/.test(line)) {
      const items = [line.replace(/^[-*]\s/, '')];
      while (/^\s*[-*]\s/.test(lines[index + 1] ?? '')) items.push((lines[++index] ?? '').trim().replace(/^[-*]\s/, ''));
      blocks.push({ type: 'list', items }); continue;
    }
    blocks.push({ type: 'paragraph', text: line });
  }
  return blocks;
}
