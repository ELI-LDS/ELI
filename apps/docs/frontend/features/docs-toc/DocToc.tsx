import type { DocHeading } from './types';
import { DocTocLinks } from './DocTocLinks';
import './DocToc.css';

export function DocToc({ items }: { items: readonly DocHeading[] }) {
  return <nav aria-label="이 페이지 목차" className="doc-toc doc-toc--sidebar"><p>이 페이지에서</p><DocTocLinks items={items} /></nav>;
}
