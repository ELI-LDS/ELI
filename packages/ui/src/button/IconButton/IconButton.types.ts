import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type IconButtonSize = 'large' | 'medium';

export type IconButtonVariant = 'solid' | 'outline';

export type IconButtonColor = 'brand' | 'neutral';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'dangerouslySetInnerHTML' | 'aria-label' | 'children' | 'color'> {
  /** 화면에 텍스트가 없는 버튼의 동작을 화면 낭독기가 읽을 수 있게 설명해요. 반드시 입력해요. */
  'aria-label': string;

  /** 버튼에 표시할 아이콘이에요. 생략하면 Plus 아이콘을 표시해요. */
  icon?: ReactNode;

  /** 버튼 색상 조합이에요. 기본값은 `brand`예요. */
  color?: IconButtonColor;

  /** 버튼 크기예요. 기본값은 `large`예요. */
  size?: IconButtonSize;

  /** 버튼 형태예요. 기본값은 `solid`예요. */
  variant?: IconButtonVariant;

  /** 버튼을 비활성화할지 정해요. `true`이면 클릭할 수 없어요. 기본값은 `false`예요. */
  disabled?: boolean;

  /** IconButton의 루트 `button`에 전달할 클래스 이름이에요. */
  className?: string;
}
