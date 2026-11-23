import type {
  ButtonHTMLAttributes,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
} from 'react';
import type { NavigationDrawerItemProps } from '../NavigationDrawerItem/NavigationDrawerItem.types.js';

export interface NavigationDrawerSubItem
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'dangerouslySetInnerHTML' | 'children' | 'value'> {
  /** Sub Menu를 구분하고 선택 상태를 연결하는 고유 값이에요. */
  value: string;

  /** Sub Menu에 표시할 한 줄 라벨이에요. */
  label: string;
}

export interface NavigationDrawerMenuProps
  extends Omit<
    NavigationDrawerItemProps,
    'active' | 'label' | 'subItems' | 'variant'
  > {
  /** Main Menu를 구분하고 선택 상태를 연결하는 고유 값이에요. */
  value: string;

  /** Main Menu에 표시할 한 줄 라벨이에요. */
  label: string;

  /** Main Menu 아래에서 열고 닫을 Sub Menu 목록이에요. */
  subItems?: readonly NavigationDrawerSubItem[];

  /** Sub Menu가 없는 Main Menu를 선택했을 때 실행해요. Sub Menu가 있으면 펼침 동작만 실행해요. */
  onClick?: MouseEventHandler<HTMLButtonElement>;

  /** Sub Menu가 선택될 때 해당 값과 클릭 이벤트를 전달해요. */
  onSubItemClick?: (
    value: string,
    event: MouseEvent<HTMLButtonElement>,
  ) => void;

  /** Main Menu의 기본 상태에 표시할 outlined 아이콘이에요. */
  outlinedIcon?: ReactNode;

  /** 활성 Main Menu에서만 표시할 filled 아이콘이에요. */
  filledIcon?: ReactNode;
}
