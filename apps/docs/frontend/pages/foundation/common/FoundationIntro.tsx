import type { ReactNode } from 'react';

/** 페이지 제목과 도입 문구의 간격을 같은 기준으로 유지해요. */
export function FoundationIntro({ title, children }: { title: string; children: ReactNode }) {
  return <header className="foundation-intro">
    <h1 className="eli-typo-heading-h2">{title}</h1>
    <div className="foundation-intro__description eli-typo-body-medium">{children}</div>
  </header>;
}
