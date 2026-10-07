'use client';

import './Toggle.css';
import './Toggle.interaction.css';
import { useState } from 'react';
import type { MouseEventHandler } from 'react';
import type { ToggleProps } from './Toggle.types.js';

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
  /* State */
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked ?? internalChecked;

  /* Class Name */
  const toggleClassName = ['eli-toggle', className].filter(Boolean).join(' ');

  /* Interaction */
  const handleClick: MouseEventHandler<HTMLButtonElement> = event => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const nextChecked = !isChecked;
    if (checked === undefined) setInternalChecked(nextChecked);
    onCheckedChange?.(nextChecked);
  };

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
