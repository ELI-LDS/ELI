import type { MouseEventHandler, ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

export type ButtonSize = 'large' | 'medium';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';

export type ButtonColor = 'brand' | 'neutral';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'dangerouslySetInnerHTML' | 'children' | 'color'> {
  /** 클릭·Enter·Space로 버튼을 실행하면 호출해요. 여기에 저장·이동 같은 동작을 연결해요. */
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;

  /**
   * 루트 button 요소에 추가할 클래스예요.
   * 일반 CSS와 CSS Modules뿐 아니라 Tailwind CSS의 `w-full bg-violet-600 hover:bg-violet-700`,
   * Emotion·vanilla-extract가 만든 클래스도 그대로 전달할 수 있어요.
   */
  className?: string;

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

  /** 버튼을 비활성화해요. `true` 또는 `false`를 사용하며 기본값은 `false`예요. JSX에서는 `disabled`를 `disabled={true}`의 축약형으로 사용할 수 있어요. */
  disabled?: boolean;

  /** 버튼 색상 조합이에요. 기본값은 `brand`예요. */
  color?: ButtonColor;

  /** 버튼 크기예요. 기본값은 `large`예요. */
  size?: ButtonSize;

  /** 버튼 형태예요. 기본값은 `solid`예요. */
  variant?: ButtonVariant;
}
