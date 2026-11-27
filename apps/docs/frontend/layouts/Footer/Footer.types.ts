import type { HTMLAttributes, ReactNode } from 'react';

export interface FooterProps extends Omit<HTMLAttributes<HTMLElement>, 'dangerouslySetInnerHTML'> {
  /** 최종 확정한 안내·저작권 문구예요. 여러 문장은 p 요소 등으로 구분해요. */
  children: ReactNode;
}
