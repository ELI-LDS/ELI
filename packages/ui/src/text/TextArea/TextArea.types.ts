import type { ReactNode, TextareaHTMLAttributes } from 'react';

/* Props */
export interface TextAreaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'children' | 'placeholder'
  > {
  /** 입력 영역 위에 표시할 라벨이에요. 생략하면 `라벨`을 표시해요. */
  label?: ReactNode;

  /** 값이 없을 때 표시할 안내 문구예요. 생략하면 `내용을 입력하세요`를 표시해요. */
  placeholder?: string;

  /** 입력 영역을 비활성화할지 정해요. `true`이면 입력할 수 없어요. 기본값은 `false`예요. */
  disabled?: boolean;

  /** TextArea의 바깥 `label`에 전달할 클래스 이름이에요. 실제 `textarea`에는 적용되지 않아요. */
  className?: string;
}
