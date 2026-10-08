import type { InputHTMLAttributes, ReactNode } from 'react';

/* State */
export type TextFieldState = 'default' | 'error' | 'success' | 'disabled';

/* Props */
export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'disabled'> {
  /** 입력창 위에 표시할 라벨이에요. 생략하면 `라벨`을 표시해요. */
  label?: ReactNode;

  /** 입력창의 상태예요. 서로 겹치지 않으며 기본값은 `default`예요. */
  state?: TextFieldState;
}
