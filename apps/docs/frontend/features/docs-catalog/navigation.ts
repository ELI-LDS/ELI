import { componentPages } from './catalog';

export const componentLinks = componentPages.map(page => ({ label: page.label, value: `/components/${page.id}` }));

export const foundationLinks = [
  { label: 'Color', value: '/foundation/color' },
  { label: 'Typography', value: '/foundation/typography' },
  { label: 'Layout', value: '/foundation/layout' },
] as const;

