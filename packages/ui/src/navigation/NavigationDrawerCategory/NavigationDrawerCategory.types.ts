import type { HTMLAttributes } from 'react';

export interface NavigationDrawerCategoryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML' | 'children'> {
  /** 카테고리 행에 표시할 한 줄 이름이에요. 기본값은 `카테고리`예요. */
  label?: string;

  /** 카테고리 행의 루트 `div`에 전달할 클래스 이름이에요. */
  className?: string;
}
