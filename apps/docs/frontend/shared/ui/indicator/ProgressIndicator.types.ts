import type { HTMLAttributes } from 'react';
import type { IndicatorProgress } from '../loading/loading.types';

export interface ProgressIndicatorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML' | 'aria-label' | 'children' | 'role'> {
  /** 진행 상태를 화면 낭독기가 읽을 수 있게 설명해요. */
  'aria-label': string;

  /** 0~100 사이의 실제 진행률이에요. 범위 밖은 제한하고, 생략하거나 유효하지 않은 숫자는 반복 애니메이션으로 표시해요. */
  progress?: IndicatorProgress | undefined;

  /** ProgressIndicator의 루트 `div`에 전달할 클래스 이름이에요. */
  className?: string;
}
