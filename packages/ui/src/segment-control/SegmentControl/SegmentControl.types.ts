import type { HTMLAttributes } from 'react';

export interface SegmentControlOption {
  /** 옵션을 구분하고 선택 결과로 전달할 값이에요. */
  value: string;

  /** true이면 선택과 키보드 이동에서 제외해요. 기본값은 false예요. */
  disabled?: boolean;

  /** 옵션에 표시할 라벨이에요. */
  label: string;
}

/** map()으로 만든 목록도 전달할 수 있어요. 항목 수는 확정된 디자인 범위를 따라요. */
export type SegmentControlOptions = readonly SegmentControlOption[];

export interface SegmentControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML' | 'children' | 'defaultValue' | 'onChange'> {
  /** Segment Control이 무엇을 선택하는 영역인지 화면 낭독기가 읽을 수 있게 설명해요. */
  'aria-label': string;

  /** 표시할 옵션 목록이에요. 2~4개를 권장하며 개수를 강제로 제한하지 않아요. */
  options: SegmentControlOptions;

  /** 전체 선택을 막아요. 기본값은 false예요. */
  disabled?: boolean;

  /** 외부에서 제어하는 선택 값이에요. */
  value?: string;

  /** 비제어 방식에서 처음 선택할 값이에요. 생략하면 첫 번째 사용 가능한 옵션을 선택해요. */
  defaultValue?: string;

  /** 옵션을 선택하면 해당 `value`를 전달해요. */
  onValueChange?: (value: string) => void;

  /** SegmentControl의 루트 `div`에 전달할 클래스 이름이에요. */
  className?: string;
}
