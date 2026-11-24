import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface NavigationBarItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'dangerouslySetInnerHTML' | 'children'> {
  /** Navigation Bar Item에 표시할 한 줄 라벨이에요. */
  label?: string;

  /** 기본 상태에 표시할 outlined 아이콘이에요. */
  outlinedIcon: ReactNode;

  /** 활성 탭에만 표시할 filled 아이콘이에요. */
  filledIcon: ReactNode;

  /** `true`이면 현재 탭으로 표시하고 filled 아이콘을 사용해요. */
  active?: boolean;

  /** NavigationBarItem의 루트 `button`에 전달할 클래스 이름이에요. */
  className?: string;
}
