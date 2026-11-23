import type { HTMLAttributes } from 'react';
import type { IndicatorProgress } from '../loading.types.js';

export type LoadingIndicatorVariant = 'continuous' | 'cycle';

export interface LoadingIndicatorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML' | 'aria-label' | 'children' | 'role'> {
  /** 진행 상태를 화면 낭독기가 읽을 수 있게 설명해요. */
  'aria-label': string;

  /** 실제 진행률이에요. 값을 생략하면 반복 애니메이션으로 진행 중임을 표시해요. */
  progress?: IndicatorProgress;

  /** 진행률을 모를 때 사용할 회전 방식이에요. `continuous`는 일정하게 회전하고, `cycle`은 Figma의 2초 가감속 모션을 반복해요. */
  variant?: LoadingIndicatorVariant;

  /** LoadingIndicator의 루트 `div`에 전달할 클래스 이름이에요. */
  className?: string;
}
