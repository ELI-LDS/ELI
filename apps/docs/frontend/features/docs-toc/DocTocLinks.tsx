'use client';

import type { DocHeading } from './types';
import { useDocToc } from './useDocToc';

/** 목차 링크는 SSR에서도 제공하고 읽는 구역 표시만 클라이언트에서 보완해요. */
export function DocTocLinks({ items }: { items: readonly DocHeading[] }) {
  const active = useDocToc(items);
  return <ul>{items.map(item => <li key={item.id}>
    <a aria-current={active === item.id ? 'location' : undefined} href={`#${item.id}`}>{item.title}</a>
    {item.children ? <ul>{item.children.map(child => <li key={child.id}><a aria-current={active === child.id ? 'location' : undefined} href={`#${child.id}`}>{child.title}</a></li>)}</ul> : null}
  </li>)}</ul>;
}
