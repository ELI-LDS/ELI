'use client';

import './Chip.css';
import { XIcon } from '../../icon/XIcon.js';
import type { ChipProps } from './Chip.types.js';

/**
 * 선택한 항목이나 태그를 표시하고 필요하면 제거해요.
 *
 * @example 빠른 사용
 * `<Chip onRemove={() => removeTag()}>프론트엔드</Chip>`
 *
 * ### 주요 설정
 * - `selected`: `true`이면 선택 상태로 표시해요. 기본값은 `false`예요.
 *
 * ### 내용과 동작
 * - `children`: 칩에 표시할 내용
 * - `onRemove`: 삭제 버튼을 눌렀을 때 실행할 함수
 * - `removeLabel`: 삭제 버튼의 접근성 이름, 기본값은 `삭제`
 *
 * ### 스타일 변경
 * - `className`: 루트 `span`에 외부 클래스를 전달해요.
 * - `style`: 루트 `span`의 인라인 스타일을 바꿔요.
 */
export function Chip(props: ChipProps) {
  const {
    /* Content */
    children,

    /* State */
    selected = false,

    /* Remove */
    onRemove,
    removeLabel = '삭제',

    /* Native Element */
    className,
    ...chipProps
    } = props;
  /* Class Name */
  const chipClassName = ['eli-chip', className].filter(Boolean).join(' ');

  return (
    /* Root */
    <span {...chipProps} className={chipClassName} data-selected={selected}>
      {/* Text */}
      <span className="eli-chip__text eli-typo-label-large">{children}</span>

      {/* Remove Button */}
      <button
        aria-label={removeLabel}
        className="eli-chip__remove"
        onClick={onRemove}
        type="button"
      >
        <XIcon />
      </button>
    </span>
  );
}
