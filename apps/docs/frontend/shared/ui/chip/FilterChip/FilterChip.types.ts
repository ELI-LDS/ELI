import type { ButtonHTMLAttributes } from 'react';

export interface FilterChipOption {
  /** 화면에 표시할 옵션 이름이에요. */
  label: string;

  /** 선택 여부를 비교하는 고유한 값이에요. */
  value: string;
}

export interface FilterChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'dangerouslySetInnerHTML' | 'children'> {
  /** 필터를 선택하지 않았을 때 표시할 항목명이에요. */
  label: string;

  /** 화면에 정의된 순서대로 전달하는 전체 필터 옵션이에요. */
  options: readonly FilterChipOption[];

  /** 현재 적용한 옵션의 value 목록이에요. 기본값은 빈 배열이에요. @default [] */
  selectedValues?: readonly string[];

  /** FilterChip의 루트 `button`에 전달할 클래스 이름이에요. */
  className?: string;
}
