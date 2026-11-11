'use client';

import './NavigationBarGlassItem.css';
import type { NavigationBarGlassItemProps } from './NavigationBarGlassItem.types.js';

/**
 * NavigationBarGlass 안에서 아이콘만 표시하는 이동 항목이에요.
 *
 * @example 빠른 사용
 * `<NavigationBarGlassItem label="홈" outlinedIcon={<HomeOutlined />} filledIcon={<HomeFilled />} />`
 *
 * ### 주요 설정
 * - `label`: 화면에는 표시하지 않고 접근성 이름으로 사용하는 라벨이에요.
 * - `outlinedIcon`: 비활성 탭에서 사용하는 아이콘이에요.
 * - `filledIcon`: 활성 탭에서만 사용하는 아이콘이에요.
 * - `active`: `true`이면 활성 탭의 filled 아이콘을 사용해요.
 *
 * ### 내용과 동작
 * - 활성 상태에는 `aria-current="page"`가 적용돼요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `button`에 외부 클래스를 전달해요.
 * - `style`: 루트 `button`의 인라인 스타일을 바꿔요.
 */
export function NavigationBarGlassItem(props: NavigationBarGlassItemProps) {
  const {
    active = false,
    className,
    filledIcon,
    label,
    outlinedIcon,
    type = 'button',
    ...buttonProps
  } = props;
  const navigationBarGlassItemClassName = [
    'eli-navigation-bar-glass-item',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      {...buttonProps}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      className={navigationBarGlassItemClassName}
      data-active={active}
      type={type}
    >
      <span
        aria-hidden="true"
        className="eli-navigation-bar-glass-item__icon"
      >
        <span
          className="eli-navigation-bar-glass-item__glyph eli-navigation-bar-glass-item__glyph--outlined"
          data-visible={!active}
        >
          {outlinedIcon}
        </span>
        <span
          className="eli-navigation-bar-glass-item__glyph eli-navigation-bar-glass-item__glyph--filled"
          data-visible={active}
        >
          {filledIcon}
        </span>
      </span>
    </button>
  );
}
