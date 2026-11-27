import type { ReactNode } from 'react';
import { docInline } from './DocInline';

export function DocSection({ id, title, description, level = 2, children }: { id: string; title: string; description?: string; level?: 2 | 3; children: ReactNode }) {
  const Heading = level === 2 ? 'h2' : 'h3';
  return <section aria-labelledby={id} className="doc-section" data-level={level}>
    <header className="doc-section__intro">
      <Heading className={level === 2 ? 'eli-typo-heading-h4' : 'eli-typo-label-large'} id={id} tabIndex={-1}>{title}</Heading>
      {description ? <p>{docInline(description)}</p> : null}
    </header>
    {children}
  </section>;
}
