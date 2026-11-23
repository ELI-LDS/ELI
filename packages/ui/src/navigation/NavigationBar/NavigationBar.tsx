'use client';

import './NavigationBar.css';
import { NavigationBarItem } from '../NavigationBarItem/NavigationBarItem.js';
import type { NavigationBarProps } from './NavigationBar.types.js';
import { useNavigationBar } from './useNavigationBar.js';

/**
 * 주요 화면 사이를 이동하는 하단 Navigation Bar예요.
 *
 * @example 빠른 사용
 * `<NavigationBar aria-label="주요 메뉴" items={items} onValueChange={setValue} />`
 *
 * ### 주요 설정
 * - `items`: `{ value, label, outlinedIcon, filledIcon }` 형식의 항목, 3~5개 권장
 * - `value`: 외부에서 제어하는 활성 항목의 값
 * - `defaultValue`: 처음 활성화할 값, 기본값은 첫 번째 항목
 *
 * ### 내용과 동작
 * - 선택 항목 제거 시 비제어는 첫 항목을 선택하고, 잘못된 제어 값은 선택 표시를 숨겨요.
 * - `onValueChange`: 항목을 선택하면 해당 `value`를 받아요.
 * - 활성 탭만 `filledIcon`을 사용하고 나머지는 `outlinedIcon`을 사용해요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `nav`에 외부 클래스를 전달해요.
 * - `style`: 루트 `nav`의 인라인 스타일을 바꿔요.
 */
export function NavigationBar({
  className,
  defaultValue,
  items,
  onValueChange,
  value,
  ...navigationProps
}: NavigationBarProps) {
  const { selectedValue, selectValue } = useNavigationBar({
    defaultValue,
    items,
    onValueChange,
    value,
  });
  const navigationBarClassName = ['eli-navigation-bar', className]
    .filter(Boolean)
    .join(' ');

  return (
    <nav {...navigationProps} className={navigationBarClassName}>
      {items.map(item => (
        <NavigationBarItem
          active={item.value === selectedValue}
          filledIcon={item.filledIcon}
          key={item.value}
          label={item.label}
          onClick={() => selectValue(item.value)}
          outlinedIcon={item.outlinedIcon}
        />
      ))}
    </nav>
  );
}
