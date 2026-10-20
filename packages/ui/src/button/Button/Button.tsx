import './Button.css';
import { PlusIcon } from '../../icon/PlusIcon.js';
import type { CSSProperties } from 'react';
import type { ButtonProps } from './Button.types.js';

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
 * ### 내용과 동작
 * - `children`: 버튼 텍스트나 내용 — 기본값 `버튼`
 * - `onClick`: 버튼을 눌렀을 때 실행할 함수
 * - `type`: HTML 버튼 타입 — `button`(기본), `submit`, `reset`
 *
 * ### 스타일 변경
 * - `className`: Tailwind CSS, CSS Modules, Emotion, vanilla-extract 클래스
 * - `backgroundColor`: 직접 지정할 CSS 배경색
 * - `width`, `height`: 숫자(px) 또는 `100%`, `20rem` 같은 CSS 크기
 * - `style`: React 인라인 스타일
 *
 * 각 prop의 자세한 설명은 해당 prop에 커서를 올리면 확인할 수 있어요.
 */
export function Button(props: ButtonProps) {
  const {
    /* Content */
    children = '버튼',
    icon = <PlusIcon />,

    /* Style Options */
    backgroundColor,
    color = 'brand',
    height,
    size = 'large',
    variant = 'solid',
    width,

    /* Native Button */
    className,
    style,
    type = 'button',
    ...buttonProps
  } = props;

  /* Class Name */
  const buttonClassName = ['eli-button', className].filter(Boolean).join(' ');

  /* Custom Style */
  const buttonStyle: CSSProperties = {
    ...style,
    ...(backgroundColor !== undefined ? { backgroundColor } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(width !== undefined ? { width } : {}),
  };

  return (
    /* Root */
    <button
      {...buttonProps}
      className={buttonClassName}
      data-color={color}
      data-size={size}
      data-variant={variant}
      style={buttonStyle}
      type={type}
    >
      {/* Left Icon */}
      {icon ? <span className="eli-button__icon">{icon}</span> : null}

      {/* Text */}
      <span className="eli-button__text eli-typo-label-large">{children}</span>
    </button>
  );
}
