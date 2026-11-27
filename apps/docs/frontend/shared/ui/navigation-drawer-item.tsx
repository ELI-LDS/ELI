'use client';

import './navigation-drawer-item/NavigationDrawerItem.css';
import { ExpandMoreIcon } from './icon/ExpandMoreIcon';
import type { NavigationDrawerItemProps } from './navigation-drawer-item/NavigationDrawerItem.types';
import { useNavigationDrawerItem } from './navigation-drawer-item/useNavigationDrawerItem';

/**
 * Navigation Drawer 안에서 주 메뉴 또는 하위 메뉴 한 행을 표시해요.
 *
 * @example 빠른 사용
 * `<NavigationDrawerItem label="홈" outlinedIcon={<HomeOutlined />} filledIcon={<HomeFilled />} />`
 *
 * ### 주요 설정
 * - `variant`: `main-menu` | `sub-menu`, 기본값은 `main-menu`
 * - `active`: 현재 메뉴인지 표시해요. 활성 Main Menu에서만 filled 아이콘을 사용해요.
 * - `subItems`: Main Menu를 펼쳤을 때 표시할 Sub Menu 목록
 * - `expanded`, `defaultExpanded`: 제어·비제어 펼침 상태
 *
 * ### 선택 가이드
 * - 일반적인 Drawer 구성에는 Main Menu와 Sub Menu를 묶어 주는 `NavigationDrawerMenu`를 사용해요.
 * - 직접 행을 조립하거나 단독 상태를 표시해야 할 때만 이 컴포넌트를 사용해요.
 * - 화면으로 이동하는 1단계 메뉴는 `main-menu`, 들여쓴 하위 메뉴는 `sub-menu`를 사용해요.
 *
 * ### 내용과 동작
 * - `label`: 한 줄 메뉴 이름
 * - `onClick`: 메뉴를 선택했을 때 실행하고, 펼칠 수 있는 Main Menu라면 하위 메뉴도 열거나 닫아요.
 * - `onExpandedChange`: 펼침 상태가 바뀔 때 다음 값을 전달해요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `button`에 외부 클래스를 전달해요.
 * - `style`: 루트 `button`의 인라인 스타일을 바꿔요.
 */
export function NavigationDrawerItem(props: NavigationDrawerItemProps) {
  const {
    active = false,
    className,
    defaultExpanded = false,
    expandable = false,
    expanded,
    filledIcon,
    label,
    onClick,
    onExpandedChange,
    outlinedIcon,
    subItems,
    type = 'button',
    variant = 'main-menu',
    ...rootProps
  } = props;
  const isMainMenu = variant === 'main-menu';
  const hasSubItems = isMainMenu && subItems !== undefined && subItems !== null;
  const canExpand = isMainMenu && (expandable || hasSubItems);
  const {
    handleClick,
    isExpanded,
    subItemsId,
  } = useNavigationDrawerItem({
    defaultExpanded,
    expandable: canExpand,
    expanded,
    onClick,
    onExpandedChange,
  });

  const navigationDrawerItemClassName = [
    'eli-navigation-drawer-item',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <button
        {...rootProps}
        aria-controls={hasSubItems ? subItemsId : undefined}
        aria-current={active ? 'page' : undefined}
        aria-expanded={canExpand ? isExpanded : undefined}
        className={navigationDrawerItemClassName}
        data-active={active}
        data-variant={variant}
        onClick={handleClick}
        type={type}
      >
        <span className="eli-navigation-drawer-item__content">
          {isMainMenu && (outlinedIcon !== undefined || filledIcon !== undefined) ? (
            <span className="eli-navigation-drawer-item__left-icon">
              {active ? filledIcon : outlinedIcon}
            </span>
          ) : null}
          <span className="eli-navigation-drawer-item__label eli-typo-label-large">
            {label ?? '라벨'}
          </span>
        </span>

        {canExpand ? (
          <span
            className="eli-navigation-drawer-item__right-icon"
            data-expanded={isExpanded}
          >
            <ExpandMoreIcon />
          </span>
        ) : null}
      </button>

      {hasSubItems ? (
        <div
          aria-hidden={!isExpanded}
          className="eli-navigation-drawer-item__sub-items"
          data-expanded={isExpanded}
          id={subItemsId}
        >
          <div className="eli-navigation-drawer-item__sub-items-inner">
            {subItems}
          </div>
        </div>
      ) : null}
    </>
  );
}
