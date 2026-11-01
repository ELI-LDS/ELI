import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeSize = 'large' | 'medium';

export type BadgeType = 'neutral' | 'error' | 'success' | 'caution';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 배지에 표시할 내용이에요. */
  children: ReactNode;

  /** 배지 크기예요. 기본값은 `medium`이에요. */
  size?: BadgeSize;

  /** 배지가 전달하는 의미예요. 기본값은 `neutral`이에요. */
  type?: BadgeType;

  /** Badge의 루트 `span`에 전달할 클래스 이름이에요. */
  className?: string;
}
