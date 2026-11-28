import { parseDocument } from './parseDocument.ts';
import type { DocumentBlock } from './parseDocument.ts';

interface GuidanceGroup { title: string | null; blocks: DocumentBlock[] }
export interface GuidanceChoice { props: string; role: string; when: string }

/** 공용 조회 문구를 화면 구역으로 나눠요. 알 수 없는 형식은 원문 블록으로 보존해요. */
export function parseGuidance(markdown: string) {
  const groups: GuidanceGroup[] = [];
  for (const block of parseDocument(`## 안내\n${markdown}`).slice(1)) {
    const title = block.type === 'paragraph' ? block.text.match(/^\*\*(.+)\*\*$/)?.[1] : undefined;
    if (title) groups.push({ title, blocks: [] });
    else {
      if (!groups.length) groups.push({ title: null, blocks: [] });
      groups.at(-1)!.blocks.push(block);
    }
  }
  return groups.map(group => {
    const choices: GuidanceChoice[] = [];
    if (group.title === '선택 기준' && group.blocks.length && group.blocks.every(block => block.type === 'list')) {
      for (const block of group.blocks) {
        if (block.type !== 'list') continue;
        for (const item of block.items) {
          const match = item.match(/^((?:`[^`]+`\s*)+)—\s*([^:]+):\s*(.+)$/);
          if (!match) return { ...group, choices: null };
          choices.push({ props: match[1]!.trim(), role: match[2]!.trim(), when: match[3]!.trim() });
        }
      }
    }
    return { ...group, choices: choices.length ? choices : null };
  });
}
