'use client';

import './Toggle.css';
import './Toggle.interaction.css';
import type { ToggleProps } from './Toggle.types.js';
import { useToggle } from './useToggle.js';

/* Toggle */
export function Toggle({
  checked,
  className,
  defaultChecked = false,
  onCheckedChange,
  onClick,
  type = 'button',
  ...props
}: ToggleProps) {
  /* Toggle의 상태와 클릭 상호작용은 전용 Hook에서 관리해요. */
  const { handleClick, isChecked } = useToggle({
    checked,
    defaultChecked,
    onCheckedChange,
    onClick,
  });

  /* Class Name */
  const toggleClassName = ['eli-toggle', className].filter(Boolean).join(' ');

  /* Accessible Name */
  const ariaLabel = props['aria-label'] ?? (props['aria-labelledby'] ? undefined : '토글');

  return (
    /* Root */
    <button
      {...props}
      aria-checked={isChecked}
      aria-label={ariaLabel}
      className={toggleClassName}
      data-state={isChecked ? 'on' : 'off'}
      onClick={handleClick}
      role="switch"
      type={type}
    >
      {/* Switch */}
      <span aria-hidden="true" className="eli-toggle__switch" />
    </button>
  );
}
