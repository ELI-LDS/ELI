'use client';

import { useMemo } from 'react';
import './navigation-drawer/NavigationDrawer.css';
import { NavigationDrawerContext } from './navigation-drawer/NavigationDrawerContext';
import type { NavigationDrawerProps } from './navigation-drawer/NavigationDrawer.types';
import { useNavigationDrawer } from './navigation-drawer/useNavigationDrawer';

/**
 * 화면의 한쪽에서 주 메뉴와 하위 메뉴를 세로로 탐색해요.
 *
 * @example 빠른 사용
 * `<NavigationDrawer aria-label="서비스 메뉴"><NavigationDrawerCategory label="주요 메뉴" /><NavigationDrawerMenu label="홈" value="home" /></NavigationDrawer>`
 *
 * ### 주요 설정
 * - `aria-label`: 탐색 영역을 설명하는 필수 문구
 * - `value`, `defaultValue`: 제어·비제어 현재 메뉴 값, 기본값은 선택 없음
 *
 * ### 내용과 동작
 * - `children`: NavigationDrawerCategory, NavigationDrawerMenu와 구분선을 원하는 순서로 구성해요.
 * - `onValueChange`: 하위 메뉴가 없는 Main Menu 또는 Sub Menu가 선택되면 고유 값을 전달해요.
 * - 하위 메뉴가 있는 Main Menu는 선택값을 바꾸지 않고 전체 클릭 영역으로 열고 닫아요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `nav`에 외부 클래스를 전달해요.
 * - `style`: 루트 `nav`의 인라인 스타일을 바꿔요.
 */
export function NavigationDrawer(props: NavigationDrawerProps) {
  const {
    children,
    className,
    defaultValue,
    onValueChange,
    value,
    ...navigationProps
  } = props;
  const { selectedValue, selectValue } = useNavigationDrawer({
    defaultValue,
    onValueChange,
    value,
  });
  const contextValue = useMemo(
    () => ({ selectedValue, selectValue }),
    [selectedValue, selectValue],
  );
  const navigationDrawerClassName = ['eli-navigation-drawer', className]
    .filter(Boolean)
    .join(' ');

  return (
    <NavigationDrawerContext.Provider value={contextValue}>
      <nav {...navigationProps} className={navigationDrawerClassName}>
        {children}
      </nav>
    </NavigationDrawerContext.Provider>
  );
}
