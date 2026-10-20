import './IconButton.css';
import { PlusIcon } from '../../icon/PlusIcon.js';
import type { IconButtonProps } from './IconButton.types.js';

/**
 * 아이콘 하나로 동작을 실행하는 버튼이에요.
 *
 * @example 빠른 사용
 * `<IconButton aria-label="항목 추가" />`
 *
 * ### 주요 설정
 * - `variant`: `solid`(기본값), `outline`
 * - `color`: `brand`(기본값), `neutral`
 * - `size`: `large`(기본값), `medium`
 * - `disabled`: `true`이면 비활성화해요.
 *
 * ### 내용과 동작
 * - `aria-label`: 아이콘의 동작을 설명하는 필수 이름
 * - `icon`: 표시할 아이콘, 기본값은 Plus 아이콘
 * - `onClick`: 클릭했을 때 실행할 함수
 *
 * ### 스타일 변경
 * - `className`: 루트 `button`에 외부 클래스를 전달해요.
 * - `style`: 루트 `button`의 인라인 스타일을 바꿔요.
 */
export function IconButton(props: IconButtonProps) {
  const {
    /* Content */
    icon = <PlusIcon />,

    /* Style Options */
    color = 'brand',
    size = 'large',
    variant = 'solid',

    /* Native Button */
    className,
    type = 'button',
    ...buttonProps
    } = props;
  /* Class Name */
  const iconButtonClassName = ['eli-icon-button', className].filter(Boolean).join(' ');

  return (
    /* Root */
    <button
      {...buttonProps}
      className={iconButtonClassName}
      data-color={color}
      data-size={size}
      data-variant={variant}
      type={type}
    >
      {/* Icon */}
      <span className="eli-icon-button__icon">{icon}</span>
    </button>
  );
}
