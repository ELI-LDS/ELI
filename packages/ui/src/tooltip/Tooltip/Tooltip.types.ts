import type { HTMLAttributes, ReactNode } from 'react';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** 툴팁에 표시할 내용이에요. 줄바꿈이 포함된 텍스트도 사용할 수 있어요. */
  children: ReactNode;

  /** Tooltip의 루트 `div`에 전달할 클래스 이름이에요. */
  className?: string;
}
