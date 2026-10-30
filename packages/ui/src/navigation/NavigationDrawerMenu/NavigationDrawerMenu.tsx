'use client';

import type { MouseEvent } from 'react';
import { useNavigationDrawerContext } from '../NavigationDrawer/NavigationDrawerContext.js';
import { NavigationDrawerItem } from '../NavigationDrawerItem/NavigationDrawerItem.js';
import type {
  NavigationDrawerMenuProps,
  NavigationDrawerSubItem,
} from './NavigationDrawerMenu.types.js';

const EMPTY_SUB_ITEMS: readonly NavigationDrawerSubItem[] = [];

/**
 * 하나의 Main Menu와 연결된 Sub Menu를 묶어 Drawer에 배치해요.
 *
 * @example 빠른 사용
 * `<NavigationDrawerMenu label="학습" value="learning" subItems={[{ value: 'course', label: '내 강의' }]} />`
 *
 * ### 주요 설정
 * - `value`: Main Menu의 고유 값
 * - `subItems`: `{ value, label }` 형태의 하위 메뉴 목록
 * - `expanded`, `defaultExpanded`: 제어·비제어 펼침 상태
 *
 * ### 내용과 동작
 * - Main Menu와 Sub Menu의 선택값은 가장 가까운 NavigationDrawer가 관리해요.
 * - Main Menu가 활성화된 경우에만 filled 아이콘을 사용해요.
 * - Sub Menu가 없으면 Main Menu를 선택하고 `onClick`을 실행해요.
 * - Sub Menu가 있으면 Main Menu 전체를 눌러 열고 닫으며 선택·이동 동작은 실행하지 않아요.
 *
 * ### 스타일 변경
 * - `className`: Main Menu의 루트 `button`에 외부 클래스를 전달해요.
 * - 각 Sub Menu에는 `subItems` 항목의 `className`을 전달할 수 있어요.
 */
export function NavigationDrawerMenu(props: NavigationDrawerMenuProps) {
  const {
    label,
    onClick,
    onSubItemClick,
    subItems = EMPTY_SUB_ITEMS,
    value,
    ...itemProps
  } = props;
  const { selectedValue, selectValue } = useNavigationDrawerContext();
  const hasSubItems = subItems.length > 0;

  const handleMainClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (hasSubItems) return;

    onClick?.(event);
    if (!event.defaultPrevented) selectValue(value);
  };

  const renderSubItem = (subItem: NavigationDrawerSubItem) => {
    const {
      label: subLabel,
      onClick: onSubClick,
      value: subValue,
      ...subItemProps
    } = subItem;

    return (
      <NavigationDrawerItem
        {...subItemProps}
        active={selectedValue === subValue}
        key={subValue}
        label={subLabel}
        onClick={event => {
          onSubClick?.(event);
          if (event.defaultPrevented) return;
          selectValue(subValue);
          onSubItemClick?.(subValue, event);
        }}
        variant="sub-menu"
      />
    );
  };

  const renderedSubItems = subItems.map(renderSubItem);

  return (
    <NavigationDrawerItem
      {...itemProps}
      {...(renderedSubItems.length > 0 ? { subItems: renderedSubItems } : {})}
      active={selectedValue === value}
      label={label}
      onClick={handleMainClick}
    />
  );
}
