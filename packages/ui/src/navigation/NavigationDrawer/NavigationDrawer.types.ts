import type { HTMLAttributes, ReactNode } from 'react';

export interface NavigationDrawerProps
  extends Omit<HTMLAttributes<HTMLElement>, 'aria-label' | 'children' | 'defaultValue'> {
  /** Drawer 안에 배치할 NavigationDrawerMenu와 Divider예요. */
  children: ReactNode;

  /** Navigation Drawer가 담당하는 탐색 영역을 화면 낭독기에 설명해요. */
  'aria-label': string;

  /** NavigationDrawer의 루트 `nav`에 전달할 클래스 이름이에요. */
  className?: string;

  /** 외부에서 제어하는 현재 메뉴의 고유 값이에요. */
  value?: string;

  /** 제어하지 않는 Drawer에서 처음 선택할 메뉴의 고유 값이에요. 생략하면 선택 없이 시작해요. */
  defaultValue?: string;

  /** 하위 메뉴가 없는 Main Menu 또는 Sub Menu가 선택될 때 해당 고유 값을 전달해요. */
  onValueChange?: (value: string) => void;
}
