import './Dim.css';
import type { DimProps } from './Dim.types.js';

/* Dim */
export function Dim({ className, ...props }: DimProps) {
  /* Class Name */
  const dimClassName = ['eli-dim', className].filter(Boolean).join(' ');

  return <div {...props} aria-hidden="true" className={dimClassName} />;
}
