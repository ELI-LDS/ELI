import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import type { FilterChipProps, FilterChipOption } from '../FilterChip/FilterChip.types.js';
import type { RemovableChipProps } from '../RemovableChip/RemovableChip.types.js';

export interface SelectableChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'dangerouslySetInnerHTML' | 'children'> {
  /** 선택은 `selectable`, 필터 설정은 `filter`, 삭제는 `removable`을 사용해요. 기본값은 `selectable`이에요. @default 'selectable' */
  variant?: 'selectable';

  /** 칩에 표시할 라벨이에요. 최대 너비를 넘으면 말줄임표로 표시해요. */
  children: ReactNode;

  /** 선택된 상태로 표시할지 정해요. 기본값은 `false`예요. @default false */
  selected?: boolean;

  /** 칩을 누르면 다음 선택 상태를 전달해요. 실제 선택 상태는 부모에서 갱신해요. */
  onSelectedChange?: (selected: boolean) => void;

  /** 선택형 클릭·필터 열기·삭제형 라벨 클릭에 연결해요. X 버튼은 `onRemove`를 사용해요. */
  onClick?: MouseEventHandler<HTMLButtonElement>;

  /** `true`이면 해당 variant의 버튼을 누를 수 없어요. 기본값은 `false`예요. @default false */
  disabled?: boolean;

  /** 선택·필터형의 루트 `button`, 삭제형의 바깥 `span`에 전달하는 클래스 이름이에요. */
  className?: string;
}

/** 칩의 역할을 선택해요. 각 역할에 필요한 속성만 함께 전달할 수 있어요. */
export type ChipProps =
  | SelectableChipProps
  | (FilterChipProps & {
      /** 별도 필터 화면을 열고 적용한 값을 요약해요. */
      variant: 'filter';
    })
  | (RemovableChipProps & {
      /** X 버튼으로 조건이나 태그를 제거해요. `onRemove`를 함께 전달해요. */
      variant: 'removable';
    });

/** 필터 variant의 전체 옵션 한 개예요. */
export type ChipOption = FilterChipOption;
export type ChipVariant = 'selectable' | 'filter' | 'removable';
