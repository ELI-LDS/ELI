'use client';

import { useCodeCopy } from '../../../features/code-block/useCodeCopy';
import './InstallationCommand.css';

/** 부가 장식 없이 명령 원문을 표시하고 그대로 복사해요. */
export function InstallationCommand({ command }: { command: string }) {
  const { status, copy } = useCodeCopy(command);
  return <div className="doc-terminal">
    <div className="doc-terminal__row">
      <pre aria-label="컴포넌트 추가 명령" role="region" tabIndex={0}><code>{command}</code></pre>
      <button aria-label="컴포넌트 추가 명령 복사" className="doc-terminal__copy" onClick={copy} type="button">{status === 'success' ? '복사됨' : '복사'}</button>
    </div>
    <span aria-live="polite" className={status === 'error' ? 'doc-terminal__error' : 'docs-sr-only'}>{status === 'error' ? '복사하지 못했어요. 명령을 선택해 복사해주세요.' : status === 'success' ? '명령을 복사했어요.' : ''}</span>
  </div>;
}
