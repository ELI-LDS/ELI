'use client';

import './navigation-bar-item/NavigationBarItem.css';
import type { NavigationBarItemProps } from './navigation-bar-item/NavigationBarItem.types';

/**
 * Navigation Bar 안에서 하나의 이동 항목을 표시해요.
 *
 * @example 빠른 사용
 * `<NavigationBarItem label="홈" outlinedIcon={<HomeOutlined />} filledIcon={<HomeFilled />} />`
 *
 * ### 주요 설정
 * - `label`: 아이콘 아래에 표시할 한 줄 라벨, 기본값은 `라벨`
 * - `outlinedIcon`: 기본 탭에서 사용하는 아이콘
 * - `filledIcon`: 활성 탭에서만 사용하는 아이콘
 * - `active`: `true`이면 활성 탭의 색상과 filled 아이콘을 사용해요.
 *
 * ### 내용과 동작
 * - `onClick`: 항목을 선택했을 때 실행할 함수
 * - 활성 상태에는 `aria-current="page"`가 적용돼요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `button`에 외부 클래스를 전달해요.
 * - `style`: 루트 `button`의 인라인 스타일을 바꿔요.
 */
export function NavigationBarItem({
  active = false,
  className,
  filledIcon,
  label = '라벨',
  outlinedIcon,
  type = 'button',
  ...buttonProps
}: NavigationBarItemProps) {
  const navigationBarItemClassName = ['eli-navigation-bar-item', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...buttonProps}
      aria-current={active ? 'page' : undefined}
      className={navigationBarItemClassName}
      data-active={active}
      type={type}
    >
      <span className="eli-navigation-bar-item__content">
        <span className="eli-navigation-bar-item__icon">
          {active ? filledIcon : outlinedIcon}
        </span>
        <span className="eli-navigation-bar-item__label eli-typo-label-small">
          {label}
        </span>
      </span>
    </button>
  );
}
