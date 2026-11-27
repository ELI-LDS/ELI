import { tokenGroups } from '../../common/tokenGroups';
import type { LayoutToken } from '../layout.types';

export const layoutSections = {
  usage: { id: 'usage', title: '사용 방법' },
  scale: { id: 'scale', title: 'Scale' },
  spacing: { id: 'spacing', title: 'Spacing' },
  padding: { id: 'padding', title: 'padding' },
  gap: { id: 'gap', title: 'gap' },
  radius: { id: 'radius', title: 'Radius' },
  tokens: { id: 'tokens', title: '전체 토큰' },
};
export const layoutHeadings = [layoutSections.usage, layoutSections.scale, { ...layoutSections.spacing, children: [layoutSections.padding, layoutSections.gap] }, layoutSections.radius, layoutSections.tokens];

const title = (value: string) => value[0]?.toUpperCase() + value.slice(1);

export function getLayoutData() {
  const groups = tokenGroups('layout');
  const scale: LayoutToken[] = Object.entries(groups.find(group => group.group === 'Scale')?.tokens ?? {}).map(([name, value]) => ({
    name, value, number: Number.parseFloat(value), label: `Scale/${name.split('-').at(-1)}`,
  }));
  const responsive: LayoutToken[] = Object.entries(groups.find(group => group.group === 'Responsive')?.tokens ?? {}).map(([name, value]) => ({
    name, value, number: Number.parseFloat(value), label: `Responsive/${title(name.split('-').at(-1) ?? '')}`,
  }));
  return { scale, responsive };
}

