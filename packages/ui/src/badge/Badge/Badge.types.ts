import type { HTMLAttributes, ReactNode } from 'react';

/* Size */
export type BadgeSize = 'large' | 'medium';

/* Props */
export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 배지에 표시할 내용이에요. */
  children: ReactNode;

  /** 배지 크기예요. 기본값은 `large`예요. */
  size?: BadgeSize;

  /** Badge의 루트 `span`에 전달할 클래스 이름이에요. */
  className?: string;
}
