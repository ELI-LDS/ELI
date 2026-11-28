import { refractor } from 'refractor/core';
import tsx from 'refractor/tsx';
import css from 'refractor/css';
import json from 'refractor/json';
import bash from 'refractor/bash';

// 문서에서 쓰는 언어만 등록하고 전체 언어 묶음은 불러오지 않아요.
for (const grammar of [tsx, css, json, bash]) refractor.register(grammar);

// 접두 문자를 소비하는 TSX 규칙은 <> 바로 다음 태그를 놓쳐요.
// 제네릭 타입과의 구분은 유지하면서 앞 문자를 읽기만 하도록 보완해요.
const tsxGrammar = refractor.languages.tsx;
const jsxGrammar = refractor.languages.jsx;
if (tsxGrammar && jsxGrammar && 'tag' in tsxGrammar && 'tag' in jsxGrammar) {
  const tsxTag = tsxGrammar.tag;
  const jsxTag = jsxGrammar.tag;
  if (tsxTag && typeof tsxTag === 'object' && jsxTag && typeof jsxTag === 'object' && 'pattern' in jsxTag && jsxTag.pattern instanceof RegExp) {
    Object.assign(tsxTag, {
      pattern: new RegExp(`(?:(?<![\\w$])|(?=</))(?:${jsxTag.pattern.source})`, jsxTag.pattern.flags),
      lookbehind: false,
    });
  }
}

interface CodeToken { text: string; className: string }

/** 전체 코드를 먼저 분석해 여러 줄 주석·문자열의 문맥을 유지해요. HTML은 실행하지 않아요. */
export function highlightCode(code: string, language: string): CodeToken[][] {
  const source = code.replace(/\r\n?/g, '\n');
  const lines: CodeToken[][] = [[]];
  const append = (text: string, className: string) => {
    text.split('\n').forEach((part, index) => {
      if (index > 0) lines.push([]);
      if (part) lines[lines.length - 1]!.push({ text: part, className });
    });
  };
  if (!refractor.registered(language)) {
    append(source, '');
    return lines;
  }
  const tree = refractor.highlight(source, language);
  const visit = (node: typeof tree.children[number], classes: string[] = []) => {
    if (node.type === 'text') append(node.value, [...new Set(classes)].join(' '));
    else if (node.type === 'element') {
      const className = node.properties.className;
      const ownClasses = Array.isArray(className) ? className.map(String) : typeof className === 'string' ? [className] : [];
      // 중첩된 JS 표현식이 바깥 JSX 태그 색상을 물려받지 않도록 가장 가까운 분류를 사용해요.
      node.children.forEach(child => visit(child, ownClasses.length ? ownClasses : classes));
    }
  };
  tree.children.forEach(node => visit(node));
  return lines;
}
