import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface FabProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'dangerouslySetInnerHTML' | 'children'> {
  /** FAB에 표시할 한 줄 라벨이에요. 기본값은 `버튼`이에요. */
  label?: string;

  /** 닫힌 FAB에 표시할 아이콘이에요. 생략하면 Add 아이콘을 사용하고, `null`이면 숨겨요. */
  icon?: ReactNode | null;

  /** 열린 FAB에 표시할 아이콘이에요. 생략하면 Close 아이콘을 사용하고, `null`이면 숨겨요. */
  expandedIcon?: ReactNode | null;

  /** FAB Menu가 열려 있는지 표시해요. 열린 상태에서는 Neutral 배경과 닫기 아이콘을 사용해요. */
  expanded?: boolean;

  /** 닫힌 FAB에서 아이콘 옆 라벨을 보여줄지 정해요. 기본값은 `true`예요. */
  showLabel?: boolean;

  /** 루트 button 요소에 외부 클래스를 전달해요. */
  className?: string;
}
