import type { HTMLAttributes, ReactNode } from 'react';

export interface NavigationBarGlassOption {
  /** 항목을 구분하고 선택 결과로 전달할 값이에요. */
  value: string;

  /** 화면에는 표시하지 않고 화면 낭독기에 전달할 라벨이에요. */
  label: string;

  /** 기본 상태에 표시할 outlined 아이콘이에요. */
  outlinedIcon: ReactNode;

  /** 활성 탭에만 표시할 filled 아이콘이에요. */
  filledIcon: ReactNode;
}

/** NavigationBarGlass는 디자인 명세에 맞게 3개부터 5개까지 항목을 받아요. */
export type NavigationBarGlassOptions =
  | readonly [
      NavigationBarGlassOption,
      NavigationBarGlassOption,
      NavigationBarGlassOption,
    ]
  | readonly [
      NavigationBarGlassOption,
      NavigationBarGlassOption,
      NavigationBarGlassOption,
      NavigationBarGlassOption,
    ]
  | readonly [
      NavigationBarGlassOption,
      NavigationBarGlassOption,
      NavigationBarGlassOption,
      NavigationBarGlassOption,
      NavigationBarGlassOption,
    ];

export interface NavigationBarGlassProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'defaultValue' | 'onChange'> {
  /** Navigation Bar의 목적을 화면 낭독기가 읽을 수 있게 설명해요. */
  'aria-label': string;

  /** 표시할 이동 항목 목록이에요. 3개부터 5개까지 전달할 수 있어요. */
  items: NavigationBarGlassOptions;

  /** 외부에서 제어하는 활성 항목의 값이에요. */
  value?: string;

  /** 비제어 방식에서 처음 활성화할 값이에요. 생략하면 첫 번째 항목을 사용해요. */
  defaultValue?: string;

  /** 항목을 선택하면 해당 `value`를 전달해요. */
  onValueChange?: (value: string) => void;

  /** NavigationBarGlass의 루트 `nav`에 전달할 클래스 이름이에요. */
  className?: string;
}
