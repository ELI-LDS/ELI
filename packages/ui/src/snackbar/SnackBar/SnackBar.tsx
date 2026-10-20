'use client';

import './SnackBar.css';
import type { SnackBarProps } from './SnackBar.types.js';

/* SnackBar */
export function SnackBar({
  action = '액션',
  actionColor,
  children = '메세지를 작성합니다.',
  className,
  onAction,
  ...props
}: SnackBarProps) {
  /* Class Name */
  const snackBarClassName = ['eli-snackbar', className].filter(Boolean).join(' ');

  return (
    /* Root */
    <div {...props} className={snackBarClassName}>
      {/* Message */}
      <span className="eli-snackbar__message eli-typo-body-medium">{children}</span>

      {/* Action */}
      {action !== undefined && action !== null ? (
        <button
          className="eli-snackbar__action eli-typo-label-large"
          onClick={onAction}
          style={actionColor !== undefined ? { color: actionColor } : undefined}
          type="button"
        >
          {action}
        </button>
      ) : null}
    </div>
  );
}
