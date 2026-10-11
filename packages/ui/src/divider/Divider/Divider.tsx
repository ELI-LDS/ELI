import './Divider.css';
import type { DividerProps } from './Divider.types.js';

/* Divider */
export function Divider({ className, ...props }: DividerProps) {
  /* Class Name */
  const dividerClassName = ['eli-divider', className].filter(Boolean).join(' ');

  return <hr {...props} className={dividerClassName} />;
}
