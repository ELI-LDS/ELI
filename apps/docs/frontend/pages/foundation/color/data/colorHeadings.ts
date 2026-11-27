import type { DocHeading } from '../../../../features/docs-toc/types';
import type { ColorTab } from '../color.types';

/** 탭의 목차와 실제 본문이 같은 앵커를 사용해요. */
export const colorSectionId = (tab: ColorTab, name: string) => `${tab}-${name.toLowerCase()}`;

export function colorHeadings(tab: ColorTab, groups: readonly { name: string }[]): readonly DocHeading[] {
  return [{ id: 'usage', title: '사용 방법' }, ...groups.map(group => ({ id: colorSectionId(tab, group.name), title: group.name }))];
}
