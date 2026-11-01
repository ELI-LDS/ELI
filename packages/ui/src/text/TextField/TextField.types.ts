import type { InputHTMLAttributes, ReactNode } from 'react';

export type TextFieldState = 'default' | 'error' | 'success' | 'disabled';

export interface TextFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'children' | 'disabled' | 'placeholder'
  > {
  /** 입력창 위에 표시할 라벨이에요. 생략하면 `라벨`을 표시해요. */
  label?: ReactNode;

  /** 값이 없을 때 표시할 안내 문구예요. 생략하면 `내용을 입력하세요`를 표시해요. */
  placeholder?: string;

  /** 입력창의 상태예요. 서로 겹치지 않으며 기본값은 `default`예요. */
  state?: TextFieldState;

  /** TextField의 바깥 `label`에 전달할 클래스 이름이에요. 실제 `input`에는 적용되지 않아요. */
  className?: string;
}
