'use client';

import './menu-item/MenuItem.css';
import './menu-item/MenuItem.interaction.css';
import type { MenuItemProps } from './menu-item/MenuItem.types';
import { useMenuItem } from './menu-item/useMenuItem';

/**
 * 메뉴나 선택 목록에서 하나의 항목을 표시해요.
 *
 * @example 빠른 사용
 * `<MenuItem shortcut="⌘K" onClick={() => openSearch()}>검색</MenuItem>`
 *
 * ### 주요 설정
 * - `leftIcon`, `rightIcon`: 양쪽에 표시할 아이콘
 * - `shortcut`: 오른쪽에 표시할 단축키 안내. 실제 키보드 동작은 별도로 연결해요.
 * - `disabled`: `true`이면 비활성화해요.
 *
 * ### 내용과 동작
 * - `children`: 항목 이름, 기본값은 `선택`
 * - `onClick`: 항목을 선택했을 때 실행할 함수
 *
 * ### 스타일 변경
 * - `className`: 루트 `button`에 외부 클래스를 전달해요.
 * - `style`: 루트 `button`의 인라인 스타일을 바꿔요.
 */
export function MenuItem(props: MenuItemProps) {
  const {
    children = '선택',
    className,
    leftIcon,
    onPointerCancel,
    onPointerDown,
    onPointerLeave,
    onPointerUp,
    rightIcon,
    shortcut,
    type = 'button',
    ...buttonProps
  } = props;
  /* Pointer 애니메이션 상태와 기존 이벤트 호출을 전용 Hook에서 관리해요. */
  const {
    handlePointerCancel,
    handlePointerDown,
    handlePointerLeave,
    handlePointerUp,
    interaction,
  } = useMenuItem({ onPointerCancel, onPointerDown, onPointerLeave, onPointerUp });

  const menuItemClassName = ['eli-menu-item', className].filter(Boolean).join(' ');

  return (
    <button
      {...buttonProps}
      className={menuItemClassName}
      data-interaction={interaction}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
      type={type}
    >
      {leftIcon !== undefined && leftIcon !== null ? (
        <span className="eli-menu-item__left-icon">{leftIcon}</span>
      ) : null}
      <span className="eli-menu-item__text">
        <span className="eli-menu-item__label eli-typo-body-medium">{children}</span>
      </span>
      {shortcut !== undefined && shortcut !== null ? (
        <span className="eli-menu-item__shortcut eli-typo-label-medium">{shortcut}</span>
      ) : null}
      {rightIcon !== undefined && rightIcon !== null ? (
        <span className="eli-menu-item__right-icon">{rightIcon}</span>
      ) : null}
    </button>
  );
}
