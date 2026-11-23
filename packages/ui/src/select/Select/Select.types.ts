import type { HTMLAttributes, ReactNode } from 'react';

export interface SelectOption {
  /** 선택 값으로 사용하는 고유한 문자열이에요. */
  value: string;

  /** 옵션 행에 표시할 내용이에요. */
  label: ReactNode;
}

export interface SelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  /** 선택 영역 위에 표시할 라벨이에요. 생략하면 `라벨`을 표시해요. */
  label?: ReactNode;

  /** 값을 선택하기 전에 표시할 안내 문구예요. 생략하면 `선택해주세요.`를 표시해요. */
  placeholder?: ReactNode;

  /** 목록에 표시할 옵션이에요. 각 value는 중복되지 않아야 해요. */
  options: readonly SelectOption[];

  /** 외부에서 제어하는 선택 값이에요. */
  value?: string;

  /** 제어하지 않을 때 처음 선택할 값이에요. */
  defaultValue?: string;

  /** 옵션을 선택했을 때 선택한 value를 전달해요. */
  onValueChange?: (value: string) => void;

  /** 바깥 div의 너비·배치 등에 적용해요. 내부 선택 버튼·목록의 배경·테두리·글자 크기를 직접 바꾸지는 않아요. 같은 속성을 style에도 지정하면 인라인 지정이 일반 클래스보다 우선해요. */
  className?: string;
}
