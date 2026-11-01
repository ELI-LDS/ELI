import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** 칩에 표시할 라벨이에요. 최대 너비를 넘으면 말줄임표로 표시해요. */
  children: ReactNode;

  /** 선택된 상태로 표시할지 정해요. 기본값은 `false`예요. */
  selected?: boolean;

  /** 칩을 누르면 다음 선택 상태를 전달해요. 실제 선택 상태는 부모에서 갱신해요. */
  onSelectedChange?: (selected: boolean) => void;

  /** Chip의 루트 `button`에 전달할 클래스 이름이에요. */
  className?: string;
}
