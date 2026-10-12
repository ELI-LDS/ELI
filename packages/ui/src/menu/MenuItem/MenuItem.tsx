'use client';

import './MenuItem.css';
import './MenuItem.interaction.css';
import type { MenuItemProps } from './MenuItem.types.js';
import { useMenuItem } from './useMenuItem.js';

/* Menu Item */
export function MenuItem({
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
  ...props
}: MenuItemProps) {
  /* Pointer 애니메이션 상태와 기존 이벤트 호출을 전용 Hook에서 관리해요. */
  const {
    handlePointerCancel,
    handlePointerDown,
    handlePointerLeave,
    handlePointerUp,
    interaction,
  } = useMenuItem({ onPointerCancel, onPointerDown, onPointerLeave, onPointerUp });

  /* Class Name */
  const menuItemClassName = ['eli-menu-item', className].filter(Boolean).join(' ');

  return (
    <button
      {...props}
      className={menuItemClassName}
      data-interaction={interaction}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
      type={type}
    >
      {/* Left Icon */}
      {leftIcon !== undefined && leftIcon !== null ? (
        <span className="eli-menu-item__left-icon">{leftIcon}</span>
      ) : null}

      {/* Text */}
      <span className="eli-menu-item__text">
        <span className="eli-menu-item__label eli-typo-body-medium">{children}</span>
      </span>

      {/* Shortcut */}
      {shortcut !== undefined && shortcut !== null ? (
        <span className="eli-menu-item__shortcut eli-typo-label-medium">{shortcut}</span>
      ) : null}

      {/* Right Icon */}
      {rightIcon !== undefined && rightIcon !== null ? (
        <span className="eli-menu-item__right-icon">{rightIcon}</span>
      ) : null}
    </button>
  );
}
