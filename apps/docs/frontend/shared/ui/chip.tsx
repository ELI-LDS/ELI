'use client';

import './chip/Chip.css';
import type { ChipProps } from './chip/Chip.types';

/**
 * 여러 옵션 중 하나 또는 여러 값을 선택할 때 사용해요.
 *
 * @example 빠른 사용
 * `<Chip selected={selected} onSelectedChange={setSelected}>장르</Chip>`
 *
 * ### 주요 설정
 * - `selected`: 선택 상태, 기본값은 `false`
 * - `disabled`: `true`이면 선택할 수 없어요.
 *
 * ### 내용과 동작
 * - `children`: 칩에 표시할 라벨
 * - `onSelectedChange`: 칩을 누르면 다음 선택 상태를 전달해요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `button`에 외부 클래스를 전달해요.
 * - `style`: 루트 `button`의 인라인 스타일을 바꿔요.
 */
export function Chip(props: ChipProps) {
  const {
    children,
    className,
    onClick,
    onSelectedChange,
    selected = false,
    type = 'button',
    ...buttonProps
  } = props;

  const chipClassName = ['eli-chip', className].filter(Boolean).join(' ');

  return (
    <button
      {...buttonProps}
      aria-pressed={selected}
      className={chipClassName}
      data-selected={selected}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) onSelectedChange?.(!selected);
      }}
      type={type}
    >
      <span className="eli-chip__label eli-typo-label-large">{children}</span>
    </button>
  );
}
