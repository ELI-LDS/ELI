'use client';

import './Fab.css';
import type { FabProps } from './Fab.types.js';

/**
 * 화면의 주요 액션을 실행하거나 FAB Menu를 여는 버튼이에요.
 *
 * @example 빠른 사용
 * `<Fab aria-label="게시물 작성" onClick={openEditor} showLabel={false} />`
 *
 * ### 주요 설정
 * - `expanded`: FAB Menu가 열렸는지 표시해요. 기본값은 `false`예요.
 * - `showLabel`: 닫힌 FAB의 라벨 표시 여부예요. 기본값은 `true`예요.
 * - `label`: 화면과 화면 낭독기에 전달할 이름이에요. 기본값은 `버튼`이에요.
 *
 * ### 선택 가이드
 * - 하나의 주요 액션을 바로 실행할 때는 FAB를 단독으로 사용해요.
 * - 여러 액션을 펼쳐야 한다면 상태 관리를 포함한 `FabMenu`를 사용해요.
 * - 아이콘만으로 의미가 분명하지 않다면 `showLabel`을 유지해요.
 *
 * ### 내용과 동작
 * - `onClick`: FAB를 눌렀을 때 주요 액션이나 메뉴 열기 동작을 실행해요.
 * - `icon`, `expandedIcon`: 기본 Add·Close 아이콘을 다른 아이콘으로 바꿔요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `button`에 외부 클래스를 전달해요.
 * - `style`: 루트 `button`의 인라인 스타일을 바꿔요.
 */
export function Fab(props: FabProps) {
  const hasExpandedState = props.expanded !== undefined;
  const {
    'aria-label': ariaLabel,
    className,
    expanded = false,
    expandedIcon,
    icon,
    label = '버튼',
    showLabel = true,
    type = 'button',
    ...buttonProps
  } = props;
  const fabClassName = ['eli-fab', className].filter(Boolean).join(' ');
  const visibleIcon = expanded ? expandedIcon : icon;
  const defaultIcon = expanded ? 'close' : 'add';

  return (
    <button
      {...buttonProps}
      aria-expanded={hasExpandedState ? expanded : undefined}
      aria-label={ariaLabel ?? label}
      className={fabClassName}
      data-expanded={expanded}
      type={type}
    >
      {visibleIcon !== null && (
        <span
          aria-hidden="true"
          className="eli-fab__icon"
          data-default-icon={visibleIcon === undefined ? defaultIcon : undefined}
        >
          {visibleIcon}
        </span>
      )}

      {!expanded && showLabel && (
        <span className="eli-fab__label eli-typo-label-large">{label}</span>
      )}
    </button>
  );
}
