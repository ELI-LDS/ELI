'use client';

import { DocToc } from '../../../../features/docs-toc/DocToc';
import type { DocHeading } from '../../../../features/docs-toc/types';
import type { ColorTab } from '../color.types';
import { useActiveColorTab } from './useActiveColorTab';

export function ColorToc({ initialTab, primitive, semantic }: { initialTab: ColorTab; primitive: readonly DocHeading[]; semantic: readonly DocHeading[] }) {
  const activeTab = useActiveColorTab(initialTab);
  return <DocToc items={activeTab === 'semantic' ? semantic : primitive} />;
}
