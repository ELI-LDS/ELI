'use client';

import './toggle/Toggle.css';
import './toggle/Toggle.interaction.css';
import type { ToggleProps } from './toggle/Toggle.types';
import { useToggle } from './toggle/useToggle';

/**
 * 하나의 설정을 On 또는 Off로 전환해요.
 *
 * @example 빠른 사용
 * `<Toggle aria-label="알림 설정" onCheckedChange={setEnabled} />`
 *
 * ### 주요 설정
 * - `checked`: 외부에서 제어하는 On/Off 상태
 * - `defaultChecked`: 처음 상태, 기본값은 `false`
 * - `disabled`: `true`이면 비활성화해요.
 *
 * ### 내용과 동작
 * - `aria-label`: 화면 낭독기가 읽을 Toggle 동작 설명
 * - `onCheckedChange`: 바뀐 상태를 받는 함수
 *
 * ### 스타일 변경
 * - `className`: 루트 `button`에 외부 클래스를 전달해요.
 * - `style`: 루트 `button`의 인라인 스타일을 바꿔요.
 */
export function Toggle(props: ToggleProps) {
  const {
    checked,
    className,
    defaultChecked = false,
    onCheckedChange,
    onClick,
    type = 'button',
    ...buttonProps
  } = props;
  /* Toggle의 상태와 클릭 상호작용은 전용 Hook에서 관리해요. */
  const { handleClick, isChecked } = useToggle({
    checked,
    defaultChecked,
    onCheckedChange,
    onClick,
  });

  const toggleClassName = ['eli-toggle', className].filter(Boolean).join(' ');

  /* 외부 설명이 없을 때도 이름 없는 switch가 되지 않도록 기본 설명을 사용해요. */
  const ariaLabel =
    buttonProps['aria-label'] ?? (buttonProps['aria-labelledby'] ? undefined : '토글');

  return (
    <button
      {...buttonProps}
      aria-checked={isChecked}
      aria-label={ariaLabel}
      className={toggleClassName}
      data-state={isChecked ? 'on' : 'off'}
      onClick={handleClick}
      role="switch"
      type={type}
    >
      <span aria-hidden="true" className="eli-toggle__switch" />
    </button>
  );
}
