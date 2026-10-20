import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';

/* Props */
export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 칩에 표시할 내용이에요. */
  children: ReactNode;

  /** 선택된 칩으로 표시할지 정해요. 기본값은 `false`예요. */
  selected?: boolean;

  /** 닫기 버튼을 누르면 호출돼요. */
  onRemove?: MouseEventHandler<HTMLButtonElement>;

  /** 화면 낭독기에 전달할 닫기 버튼 이름이에요. 기본값은 `삭제`예요. */
  removeLabel?: string;

  /** Chip의 루트 `span`에 전달할 클래스 이름이에요. */
  className?: string;
}
