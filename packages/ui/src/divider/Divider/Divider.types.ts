import type { HTMLAttributes } from 'react';

export interface DividerProps extends Omit<HTMLAttributes<HTMLHRElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /** Divider의 `hr`에 전달할 클래스 이름이에요. */
  className?: string;
}
