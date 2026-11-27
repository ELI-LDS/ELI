'use client';

import './DocsNavigation.css';
import { NavigationDrawer } from '../../shared/ui/navigation-drawer';
import { NavigationDrawerCategory } from '../../shared/ui/navigation-drawer-category';
import { NavigationDrawerMenu } from '../../shared/ui/navigation-drawer-menu';
import { Divider } from '../../shared/ui/divider';
import { foundationLinks, componentLinks } from '../docs-catalog/navigation';
import { useDocsNavigation } from './useDocsNavigation';

/** 설치한 ELI Drawer를 조립하며 아직 없는 페이지로 이동하는 링크는 만들지 않아요. */
export function DocsNavigation({ variant = 'desktop', onNavigate }: { variant?: 'desktop' | 'mobile'; onNavigate?: () => void }) {
  const { selected, navigate } = useDocsNavigation();
  return <DocsNavigationView navigate={navigate} {...(onNavigate ? { onNavigate } : {})} selected={selected} variant={variant} />;
}

/** URL 결합과 표시를 나눠 Storybook은 앱 라우터를 흉내 내지 않고 탐색 UI를 확인해요. */
export function DocsNavigationView({ selected, navigate, variant = 'desktop', onNavigate }: { selected: string; navigate: (value: string) => void; variant?: 'desktop' | 'mobile'; onNavigate?: () => void }) {
  return (
    <NavigationDrawer aria-label="문서 페이지" className={`docs-navigation docs-navigation--${variant}`} onValueChange={value => { navigate(value); onNavigate?.(); }} value={selected}>
      {variant === 'desktop' ? <NavigationDrawerCategory label="Overview" title="준비 중" /> : null}
      <span className={`docs-navigation__pending ${variant === 'mobile' ? 'docs-navigation__pending--main' : ''}`} title="준비 중">시작하기<span className="docs-sr-only"> · 준비 중</span></span>
      <NavigationDrawerMenu
        defaultExpanded={variant === 'desktop'}
        label="Foundation"
        subItems={[
          { label: 'Design Token', value: 'design-token-pending', disabled: true, title: '준비 중' },
          ...foundationLinks,
        ]}
        value="foundation"
      />
      {variant === 'desktop' ? <><Divider /><NavigationDrawerCategory label="Components" /></> : null}
      {variant === 'mobile'
        ? <NavigationDrawerMenu defaultExpanded={selected.startsWith('/components/')} label="Components" subItems={componentLinks} value="components" />
        : componentLinks.map(link => <NavigationDrawerMenu key={link.value} label={link.label} value={link.value} />)}
    </NavigationDrawer>
  );
}
