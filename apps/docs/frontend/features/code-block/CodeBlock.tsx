'use client';

import { useMemo } from 'react';
import './CodeBlock.css';
import '../../shared/styles/site';
import { Button } from '../../shared/ui/button';
import type { CodeBlockProps } from './CodeBlock.types.ts';
import { useCodeBlock } from './useCodeBlock';
import { highlightCode } from './highlightCode';
import './CodeBlock.syntax.css';
import { useCodeCopy } from './useCodeCopy';

/** 코드를 미리 보고 펼쳐 읽어요. 펼친 영역은 최대 10줄이며 그 이후는 내부에서 스크롤해요. */
export function CodeBlock(props: CodeBlockProps) {
  const { code, language = 'tsx', defaultExpanded = false, label = '코드 예시', className, style } = props;
  const { expanded, contentId, contentRef, expand } = useCodeBlock(defaultExpanded);
  const lines = useMemo(() => highlightCode(code, language), [code, language]);
  const visible = expanded || lines.length <= 6;
  const { status, copy } = useCodeCopy(code);

  return (
    <div className={['docs-code-block', className].filter(Boolean).join(' ')} data-expanded={visible} style={style}>
      <div className="docs-code-block__toolbar">
        <span aria-hidden="true">{language === 'text' ? '텍스트' : language}</span>
        <button aria-label={`${label} 복사`} className="docs-code-block__copy" onClick={copy} type="button">{status === 'success' ? '복사됨' : '복사'}</button>
        <span aria-live="polite" className={status === 'error' ? 'docs-code-block__copy-error' : 'docs-sr-only'}>{status === 'error' ? '복사하지 못했어요. 코드를 선택해 복사해주세요.' : status === 'success' ? '코드를 복사했어요.' : ''}</span>
      </div>
      <pre aria-label={label} className="docs-code-block__scroll" id={contentId} ref={contentRef} role="region" tabIndex={visible ? 0 : -1}>
        <code>
          {lines.map((line, index) => (
            <span className="docs-code-block__line" key={index}>
              <span aria-hidden="true" className="docs-code-block__number">{index + 1}</span>
              <span className="docs-code-block__text">{line.length ? line.map((token, tokenIndex) => <span className={token.className || undefined} key={tokenIndex}>{token.text}</span>) : ' '}</span>
            </span>
          ))}
        </code>
      </pre>
      {visible ? null : (
        <>
          <img alt="" aria-hidden="true" className="docs-code-block__fade" src="/assets/code-fade.png" />
          <Button aria-controls={contentId} aria-expanded={false} className="docs-code-block__expand" icon={null} onClick={expand} size="medium">
            코드 보기
          </Button>
        </>
      )}
    </div>
  );
}
