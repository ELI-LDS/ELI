import type { HTMLAttributes, ReactNode } from 'react';

/* Status */
export type AlertStatus = 'error' | 'success' | 'caution' | 'info';

/* Props */
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** 알림 제목이에요. */
  title: ReactNode;

  /** 제목 아래에 표시할 본문이에요. 생략하면 제목만 표시해요. */
  message?: ReactNode;

  /** 알림 상태예요. 상태에 맞는 색상과 아이콘을 표시해요. 기본값은 `info`예요. */
  status?: AlertStatus;
}
