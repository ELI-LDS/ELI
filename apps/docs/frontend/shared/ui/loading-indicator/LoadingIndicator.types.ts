import type { HTMLAttributes } from 'react';
import type { IndicatorProgress } from '../loading/loading.types';

export type LoadingIndicatorVariant = 'continuous' | 'cycle';

export interface LoadingIndicatorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML' | 'aria-label' | 'children' | 'role'> {
  /** 진행 상태를 화면 낭독기가 읽을 수 있게 설명해요. */
  'aria-label': string;

  /** 0~100 사이의 실제 진행률이에요. 범위 밖은 제한하고, 생략하거나 유효하지 않은 숫자는 반복 애니메이션으로 표시해요. */
  progress?: IndicatorProgress | undefined;

  /** 진행률을 모를 때 사용할 회전 방식이에요. `continuous`는 일정하게 회전하고, `cycle`은 Figma의 2초 가감속 모션을 반복해요. */
  variant?: LoadingIndicatorVariant;

  /** LoadingIndicator의 루트 `div`에 전달할 클래스 이름이에요. */
  className?: string;
}
