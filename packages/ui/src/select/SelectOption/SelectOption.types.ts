import type { MouseEventHandler, ReactNode } from 'react';

/* Props */
export interface SelectOptionProps {
  id: string;
  isSelected: boolean;
  label: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}
