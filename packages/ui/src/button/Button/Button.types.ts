import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

export type ButtonSize = 'large' | 'medium';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';

export type ButtonColor = 'brand' | 'neutral';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color'> {
  /**
   * 루트 button 요소에 추가할 클래스예요.
   * 일반 CSS와 CSS Modules뿐 아니라 Tailwind CSS의 `w-full bg-violet-600 hover:bg-violet-700`,
   * Emotion·vanilla-extract가 만든 클래스도 그대로 전달할 수 있어요.
   * backgroundColor·width·height·style로 같은 속성을 지정하면 일반 클래스보다 인라인 지정이 우선해요.
   * 내부 텍스트의 글자 크기는 별도 타이포그래피로 정해져 루트의 글자 크기 클래스만으로 바뀌지 않아요.
   */
  className?: string;

  /** 버튼에 표시할 내용이에요. 생략하면 `버튼`을 표시해요. */
  children?: ReactNode;

  /** 버튼 왼쪽에 표시할 아이콘이에요. 생략하면 Plus 아이콘을 표시하고, `null`이면 숨겨요. */
  icon?: ReactNode;

  /** 버튼 배경색이에요. style의 backgroundColor와 일반 CSS의 Hover·Pressed·Disabled 배경색보다 우선해요. 상태별 색상을 클래스로 바꿀 때는 생략해요. */
  backgroundColor?: CSSProperties['backgroundColor'];

  /** 버튼의 가로 크기예요. 숫자(px)나 `100%` 같은 CSS 값을 사용해요. style의 width보다 우선하므로 반응형 크기를 클래스로 정할 때는 생략해요. */
  width?: CSSProperties['width'];

  /** 버튼의 세로 크기예요. 숫자(px)나 CSS 값을 사용해요. 크기별 기본 높이와 style의 height보다 우선하므로 반응형 높이를 클래스로 정할 때는 생략해요. */
  height?: CSSProperties['height'];

  /** 버튼을 비활성화해요. `true` 또는 `false`를 사용하며 기본값은 `false`예요. JSX에서는 `disabled`를 `disabled={true}`의 축약형으로 사용할 수 있어요. */
  disabled?: boolean;

  /** 버튼 색상 조합이에요. 기본값은 `brand`예요. */
  color?: ButtonColor;

  /** 버튼 크기예요. 기본값은 `large`예요. */
  size?: ButtonSize;

  /** 버튼 형태예요. 기본값은 `solid`예요. */
  variant?: ButtonVariant;
}
