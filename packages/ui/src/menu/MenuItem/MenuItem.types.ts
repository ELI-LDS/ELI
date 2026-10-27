import type { ButtonHTMLAttributes, ReactNode } from 'react';

/* Props */
export interface MenuItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** 메뉴 항목에 표시할 내용이에요. 생략하면 `선택`을 표시해요. */
  children?: ReactNode;

  /** 텍스트 왼쪽에 표시할 아이콘이에요. */
  leftIcon?: ReactNode;

  /** 텍스트 오른쪽에 표시할 아이콘이에요. */
  rightIcon?: ReactNode;

  /** 메뉴 항목을 비활성화할지 정해요. `true`이면 선택할 수 없어요. 기본값은 `false`예요. */
  disabled?: boolean;

  /** MenuItem의 루트 `button`에 전달할 클래스 이름이에요. */
  className?: string;
}
