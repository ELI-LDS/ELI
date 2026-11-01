import type { HTMLAttributes } from 'react';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** Divider의 `hr`에 전달할 클래스 이름이에요. */
  className?: string;
}
