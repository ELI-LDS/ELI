'use client';

import './button/Button.css';
import { PlusIcon } from './icon/PlusIcon';
import type { CSSProperties } from 'react';
import type { ButtonProps } from './button/Button.types';

/**
 * 아이콘과 텍스트를 함께 표시하는 ELI 버튼이에요.
 *
 * @example 빠른 사용
 * ```tsx
 * <Button onClick={handleSave}>저장하기</Button>
 * ```
 *
 * ### 주요 설정
 * - `variant`: 버튼 모양 — `solid`(기본), `outline`, `ghost`
 * - `color`: 색상 조합 — `brand`(기본), `neutral`
 * - `size`: 버튼 크기 — `large`(기본), `medium`
 * - `icon`: 왼쪽 아이콘 — 생략하면 Plus 아이콘, `null`이면 숨김
 * - `disabled`: 비활성화 여부 — `true`, `false`(기본)
 *
 * ### 선택 가이드
 * - 문구로 동작을 설명해야 하면 Button을 사용하고, 익숙한 아이콘 하나로 충분하면 IconButton을 사용해요.
 * - `color`, `variant`, `size`의 구체적인 사용 기준은 디자이너와 합의 중이에요. 승인된 화면의 조합을 따르고 모양만 보고 임의로 선택하지 않아요.
 *
 * ### 내용과 동작
 * - `children`: 버튼 텍스트나 내용 — 기본값 `버튼`
 * - `onClick`: 버튼을 눌렀을 때 실행할 함수
 * - `type`: HTML 버튼 타입 — `button`(기본), `submit`, `reset`
 *
 * ### 스타일 변경
 * - `className`: 루트 button에 Tailwind CSS, CSS Modules, Emotion, vanilla-extract 클래스를 전달해요.
 * - `backgroundColor`: 모든 상태의 일반 CSS 배경색보다 우선해요. 상태별 색상은 이 prop을 생략하고 클래스로 지정해요.
 * - `width`, `height`: 숫자(px) 또는 CSS 크기예요. 반응형 크기를 클래스로 정할 때는 해당 prop을 생략해요.
 * - `style`: 루트 button의 인라인 스타일이에요. 같은 배경색·크기 속성은 전용 props가 우선해요.
 * - 내부 텍스트는 공통 타이포그래피를 사용하므로 루트의 글자 크기 클래스만으로 바뀌지 않아요.
 *
 * 기본 조합은 color·variant·size로 고르고, 외부 스타일로 바꾼 뒤에는 Hover·Pressed·Disabled와 포커스도 확인해요.
 * 각 prop의 자세한 설명은 해당 prop에 커서를 올리면 확인할 수 있어요.
 */
export function Button(props: ButtonProps) {
  const {
    children = '버튼',
    icon = <PlusIcon />,
    backgroundColor,
    color = 'brand',
    height,
    size = 'large',
    variant = 'solid',
    width,
    className,
    style,
    type = 'button',
    ...buttonProps
  } = props;

  const buttonClassName = ['eli-button', className].filter(Boolean).join(' ');

  /* 전용 크기·색상 props가 일반 style보다 우선하도록 마지막에 합쳐요. */
  const buttonStyle: CSSProperties = {
    ...style,
    ...(backgroundColor !== undefined ? { backgroundColor } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(width !== undefined ? { width } : {}),
  };

  return (
    <button
      {...buttonProps}
      className={buttonClassName}
      data-color={color}
      data-size={size}
      data-variant={variant}
      style={buttonStyle}
      type={type}
    >
      {icon ? <span className="eli-button__icon">{icon}</span> : null}
      <span className="eli-button__text eli-typo-label-large">{children}</span>
    </button>
  );
}
