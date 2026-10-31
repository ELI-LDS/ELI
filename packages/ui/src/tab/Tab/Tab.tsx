'use client';

import './Tab.css';
import type { TabProps } from './Tab.types.js';
import { useTab } from './useTab.js';

/**
 * 같은 화면 안에서 서로 다른 내용을 전환하는 하나의 Tab을 표시해요.
 *
 * @example 빠른 사용
 * `<Tab label="내 강의" onActiveChange={setActive} />`
 *
 * ### 주요 설정
 * - `label`: 표시할 한 줄 이름, 기본값은 `탭 이름`
 * - `active`: 외부에서 제어하는 선택 상태
 * - `defaultActive`: 처음 선택 상태, 기본값은 `true`
 *
 * ### 선택 가이드
 * - 같은 화면의 콘텐츠만 바꿀 때 사용해요.
 * - 다른 페이지로 이동하는 메뉴에는 Navigation 컴포넌트를 사용해요.
 *
 * ### 내용과 동작
 * - `onActiveChange`: 클릭 후 바뀐 선택 상태를 받는 함수
 * - 여러 Tab은 `role="tablist"`인 부모 안에 배치하고 연결할 패널의 id를 `aria-controls`로 전달해요.
 * - Hover와 Pressed는 별도 prop 없이 실제 마우스 상호작용으로 표시해요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `button`에 외부 클래스를 전달해요.
 * - `style`: 루트 `button`의 인라인 스타일을 바꿔요.
 */
export function Tab(props: TabProps) {
  const {
    active,
    className,
    defaultActive = true,
    label = '탭 이름',
    onActiveChange,
    onClick,
    type = 'button',
    ...buttonProps
  } = props;
  /* Tab의 상태와 클릭 상호작용은 전용 Hook에서 관리해요. */
  const { handleClick, isActive } = useTab({
    active,
    defaultActive,
    onActiveChange,
    onClick,
  });
  const tabClassName = ['eli-tab', className].filter(Boolean).join(' ');

  return (
    <button
      {...buttonProps}
      aria-selected={isActive}
      className={tabClassName}
      data-active={isActive}
      onClick={handleClick}
      role="tab"
      type={type}
    >
      <span className="eli-tab__label eli-typo-label-large">{label}</span>
    </button>
  );
}
