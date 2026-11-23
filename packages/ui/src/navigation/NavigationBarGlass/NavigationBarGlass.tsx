'use client';

import './NavigationBarGlass.css';
import { NavigationBarGlassItem } from '../NavigationBarGlassItem/NavigationBarGlassItem.js';
import type { NavigationBarGlassProps } from './NavigationBarGlass.types.js';
import { useNavigationBarGlass } from './useNavigationBarGlass.js';

/**
 * 주요 화면 사이를 이동하는 유리 효과의 알약형 모바일 Navigation Bar예요.
 *
 * @example 빠른 사용
 * `<NavigationBarGlass aria-label="주요 메뉴" items={items} onValueChange={setValue} />`
 *
 * ### 주요 설정
 * - `items`: `{ value, label, outlinedIcon, filledIcon }` 형식의 항목, 3~5개 권장
 * - `value`: 외부에서 제어하는 활성 항목의 값
 * - `defaultValue`: 처음 활성화할 값, 기본값은 첫 번째 항목
 *
 * ### 내용과 동작
 * - 선택 항목 제거 시 비제어는 첫 항목을 선택하고, 잘못된 제어 값은 선택 표시를 숨겨요.
 * - `onValueChange`: 탭을 누르거나 indicator를 끌어 항목을 선택하면 해당 `value`를 받아요.
 * - 활성 탭만 `filledIcon`을 사용하고 나머지는 `outlinedIcon`을 사용해요.
 * - 방향키로 포커스를 이동하고 Enter 또는 Space로 선택해요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `nav`에 외부 클래스를 전달해요.
 * - `style`: 루트 `nav`의 인라인 스타일을 바꿔요.
 * - 하단에 고정하려면 `position: fixed; inset-inline: 0; bottom: calc(16px + env(safe-area-inset-bottom));`를 외부 클래스에 지정해요.
 * - 아이폰 홈 인디케이터 영역을 피하려면 `<meta name="viewport" content="..., viewport-fit=cover">`가 필요해요.
 * - `--eli-navigation-bar-glass-gutter`, `--eli-navigation-bar-glass-max-width`로 여백과 최대 너비를 조절해요.
 * - `--eli-navigation-bar-glass-item-height`로 항목과 indicator 높이를 함께 조절해요.
 * - `--eli-navigation-bar-glass-frost`, `--eli-navigation-bar-glass-depth`,
 *   `--eli-navigation-bar-glass-light-angle`, `--eli-navigation-bar-glass-light-intensity`로 유리 효과를 조정해요.
 */
export function NavigationBarGlass(props: NavigationBarGlassProps) {
  const {
    'aria-label': ariaLabel,
    className,
    defaultValue,
    items,
    onValueChange,
    value,
    ...navigationProps
  } = props;
  const {
    handleItemClick,
    handleItemKeyDown,
    handleLostPointerCapture,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    indicatorRef,
    isDragging,
    isPressed,
    selectedValue,
    trackRef,
  } = useNavigationBarGlass({
    defaultValue,
    items,
    onValueChange,
    value,
  });
  const navigationBarGlassClassName = [
    'eli-navigation-bar-glass',
    className,
  ].filter(Boolean).join(' ');

  return (
    <nav
      {...navigationProps}
      aria-label={ariaLabel}
      className={navigationBarGlassClassName}
      data-dragging={isDragging}
      data-pressed={isPressed}
    >
      <div
        className="eli-navigation-bar-glass__track"
        onLostPointerCapture={handleLostPointerCapture}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        ref={trackRef}
      >
        {selectedValue !== undefined && <span
          aria-hidden="true"
          className="eli-navigation-bar-glass__indicator"
          ref={indicatorRef}
        />}
        {items.map((item, index) => (
          <NavigationBarGlassItem
            active={item.value === selectedValue}
            filledIcon={item.filledIcon}
            key={item.value}
            label={item.label}
            onClick={event => handleItemClick(item.value, event)}
            onKeyDown={event => handleItemKeyDown(index, event)}
            outlinedIcon={item.outlinedIcon}
          />
        ))}
      </div>
    </nav>
  );
}
