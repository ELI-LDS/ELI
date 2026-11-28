import type { ReactNode } from 'react';

/** 설명과 미리보기·표를 한 섹션으로 묶고 제목 계층을 유지해요. */
export function FoundationSection({ id, title, description, children }: { id: string; title: string; description?: ReactNode; children: ReactNode }) {
  return <section aria-labelledby={id} className="foundation-section">
    <div className="foundation-section__intro">
      <h2 className="foundation-section__title eli-typo-heading-h4" id={id} tabIndex={-1}>{title}</h2>
      {description ? <div className="eli-typo-body-medium">{description}</div> : null}
    </div>
    {children}
  </section>;
}
