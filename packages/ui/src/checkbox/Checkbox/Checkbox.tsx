'use client';

import './Checkbox.css';
import { CheckIcon } from '../../icon/CheckIcon.js';
import type { CheckboxProps } from './Checkbox.types.js';

/* Checkbox */
export function Checkbox({ className, style, ...props }: CheckboxProps) {
  /* Class Name */
  const checkboxClassName = ['eli-checkbox', className].filter(Boolean).join(' ');

  return (
    /* Root */
    <span className={checkboxClassName} style={style}>
      {/* Native Checkbox */}
      <input {...props} className="eli-checkbox__input" type="checkbox" />

      {/* Check Icon */}
      <span aria-hidden="true" className="eli-checkbox__icon">
        <CheckIcon />
      </span>
    </span>
  );
}
