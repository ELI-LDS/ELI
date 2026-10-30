import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type NavigationDrawerItemVariant = 'main-menu' | 'sub-menu';

export interface NavigationDrawerItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** 항목에 표시할 한 줄 라벨이에요. */
  label?: string;

  /** `main-menu`는 아이콘을 포함한 주 메뉴, `sub-menu`는 들여쓴 하위 메뉴예요. 기본값은 `main-menu`예요. */
  variant?: NavigationDrawerItemVariant;

  /** `true`이면 현재 메뉴로 표시해요. Main Menu에서는 filled 아이콘을 사용해요. */
  active?: boolean;

  /** Main Menu의 기본 상태에 표시할 outlined 아이콘이에요. `filledIcon`과 함께 전달해요. */
  outlinedIcon?: ReactNode;

  /** 활성 Main Menu에서만 표시할 filled 아이콘이에요. `outlinedIcon`과 함께 전달해요. */
  filledIcon?: ReactNode;

  /** `true`이면 Main Menu 오른쪽에 펼침 상태 아이콘을 표시해요. */
  expandable?: boolean;

  /** 펼칠 수 있는 Main Menu가 열려 있는지 외부에서 제어해요. */
  expanded?: boolean;

  /** 제어하지 않는 Main Menu가 처음 열려 있을지 정해요. */
  defaultExpanded?: boolean;

  /** Main Menu의 펼침 상태가 바뀔 때 다음 값을 전달해요. */
  onExpandedChange?: (expanded: boolean) => void;

  /** Main Menu를 펼쳤을 때 아래에 표시할 Sub Menu 목록이에요. */
  subItems?: ReactNode;

  /** NavigationDrawerItem의 루트 `button`에 전달할 클래스 이름이에요. */
  className?: string | undefined;
}
