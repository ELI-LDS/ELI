import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface FabMenuSegmentProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** 개별 액션 버튼에 표시할 한 줄 라벨이에요. */
  label: string;

  /** 라벨 앞에 표시할 아이콘이에요. 생략하면 Add 아이콘을 사용하고, `null`이면 숨겨요. */
  icon?: ReactNode | null;

  /** 루트 button 요소에 외부 클래스를 전달해요. */
  className?: string;
}
