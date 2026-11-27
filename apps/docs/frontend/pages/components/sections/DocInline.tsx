import type { ReactNode } from 'react';

/** 문서의 인라인 강조만 해석하고 원문 HTML은 실행하지 않아요. */
export function docInline(text: string): ReactNode {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|<br\s*\/?\s*>)/gi).map((part, index) =>
    part.startsWith('`') ? <code key={index}>{part.slice(1, -1)}</code>
      : part.startsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong>
        : /^<br/i.test(part) ? <br key={index} /> : part);
}
