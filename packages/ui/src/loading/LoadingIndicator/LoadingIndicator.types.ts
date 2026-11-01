import type { HTMLAttributes } from 'react';
import type { IndicatorProgress } from '../loading.types.js';

export interface LoadingIndicatorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'children' | 'role'> {
  /** 진행 상태를 화면 낭독기가 읽을 수 있게 설명해요. */
  'aria-label': string;

  /** 실제 진행률이에요. 값을 생략하면 반복 애니메이션으로 진행 중임을 표시해요. */
  progress?: IndicatorProgress;

  /** LoadingIndicator의 루트 `div`에 전달할 클래스 이름이에요. */
  className?: string;
}
