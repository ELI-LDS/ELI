import type { ButtonHTMLAttributes, ReactNode } from 'react';

/* Props */
export interface MenuItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** 메뉴 항목에 표시할 내용이에요. 생략하면 `선택`을 표시해요. */
  children?: ReactNode;

  /** 텍스트 왼쪽에 표시할 아이콘이에요. */
  leftIcon?: ReactNode;

  /** 텍스트 오른쪽 끝에 표시할 단축키예요. */
  shortcut?: ReactNode;

  /** 단축키 다음에 표시할 오른쪽 아이콘이에요. */
  rightIcon?: ReactNode;
}
