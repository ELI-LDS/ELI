import type { Ref, ChangeEventHandler, InputHTMLAttributes, ReactNode } from 'react';

export type TextFieldState = 'default' | 'error' | 'success' | 'disabled';

export interface TextFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'dangerouslySetInnerHTML' | 'children' | 'disabled' | 'placeholder'
  > {
  /** 실제 입력 요소에 접근할 참조예요. focus() 같은 입력 동작에 사용해요. */
  ref?: Ref<HTMLInputElement> | undefined;

  /** 입력하거나 X로 지우면 호출해요. value로 제어할 때 event.currentTarget.value를 상태에 반영해요. */
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;

  /** 입력창 위에 표시할 라벨이에요. 생략하면 `라벨`을 표시해요. */
  label?: ReactNode;

  /** 값이 없을 때 표시할 안내 문구예요. 생략하면 `내용을 입력하세요`를 표시해요. */
  placeholder?: string;

  /** 입력창의 상태예요. 서로 겹치지 않으며 기본값은 `default`예요. */
  state?: TextFieldState;

  /** TextField의 바깥 `div`에 전달할 클래스 이름이에요. 실제 `input`에는 적용되지 않아요. */
  className?: string;
}
