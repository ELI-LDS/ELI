import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

/* Size */
export type ButtonSize = 'large' | 'medium';

/* Variant */
export type ButtonVariant = 'solid' | 'outline' | 'ghost';

/* Color */
export type ButtonColor = 'primary' | 'tertiary';

/* Props */
export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color'> {
  /** 버튼에 표시할 내용이에요. 생략하면 `버튼`을 표시해요. */
  children?: ReactNode;

  /** 버튼 왼쪽에 표시할 아이콘이에요. 생략하면 Plus 아이콘을 표시하고, `null`이면 숨겨요. */
  icon?: ReactNode;

  /** 버튼 배경색이에요. 지정하면 모든 상태의 기본 배경 스타일보다 우선해요. */
  backgroundColor?: CSSProperties['backgroundColor'];

  /** 버튼의 가로 크기예요. 숫자는 px로 처리하며 `100%` 같은 CSS 값도 사용할 수 있어요. */
  width?: CSSProperties['width'];

  /** 버튼의 세로 크기예요. 숫자는 px로 처리하며 크기별 기본 높이보다 우선해요. */
  height?: CSSProperties['height'];

  /* Style Options */
  /** 버튼 색상 조합이에요. 기본값은 `primary`예요. */
  color?: ButtonColor;

  /** 버튼 크기예요. 기본값은 `large`예요. */
  size?: ButtonSize;

  /** 버튼 형태예요. 기본값은 `solid`예요. */
  variant?: ButtonVariant;
}
