import type {
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from 'react';

export interface FabMenuItem {
  /** 항목을 구분하고 React key로 사용하는 고유 값이에요. */
  id: string;

  /** 개별 액션 버튼에 표시할 한 줄 라벨이에요. */
  label: string;

  /** 개별 액션 버튼 앞에 표시할 아이콘이에요. */
  icon?: ReactNode | null;

  /** 개별 액션을 실행해요. 실행 후 FAB Menu가 닫혀요. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface FabMenuProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML' | 'children'> {
  /** 메뉴가 열렸을 때 표시할 액션 목록이에요. */
  items: readonly FabMenuItem[];

  /** 메인 FAB에 표시하고 화면 낭독기에 전달할 라벨이에요. 기본값은 `버튼`이에요. */
  label?: string;

  /** 닫힌 메인 FAB에 표시할 아이콘이에요. */
  icon?: ReactNode | null;

  /** 열린 메인 FAB에 표시할 아이콘이에요. */
  expandedIcon?: ReactNode | null;

  /** 닫힌 메인 FAB에서 라벨을 표시할지 정해요. 기본값은 `true`예요. */
  showLabel?: boolean;

  /** 외부에서 제어하는 메뉴 열림 상태예요. */
  expanded?: boolean;

  /** 제어하지 않는 메뉴의 처음 열림 상태예요. 기본값은 `false`예요. */
  defaultExpanded?: boolean;

  /** 메뉴가 열리거나 닫힐 때 다음 상태를 전달해요. */
  onExpandedChange?: (expanded: boolean) => void;

  /** 루트 div 요소에 외부 클래스를 전달해요. */
  className?: string;
}
