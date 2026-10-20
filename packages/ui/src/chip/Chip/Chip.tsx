'use client';

import './Chip.css';
import { XIcon } from '../../icon/XIcon.js';
import type { ChipProps } from './Chip.types.js';

/* Chip */
export function Chip({
  /* Content */
  children,

  /* State */
  selected = false,

  /* Remove */
  onRemove,
  removeLabel = '삭제',

  /* Native Element */
  className,
  ...props
}: ChipProps) {
  /* Class Name */
  const chipClassName = ['eli-chip', className].filter(Boolean).join(' ');

  return (
    /* Root */
    <span {...props} className={chipClassName} data-selected={selected}>
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
