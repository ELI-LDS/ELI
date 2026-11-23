import type { ReactNode, TextareaHTMLAttributes } from 'react';

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

  /** 바깥 label의 너비·배치 등에 적용해요. 내부 textarea의 배경·테두리·글자 크기·높이를 직접 바꾸지는 않아요. 같은 속성을 style에도 지정하면 인라인 지정이 일반 클래스보다 우선해요. */
  className?: string;
}
