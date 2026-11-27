'use client';

import type { ReactNode } from 'react';
import { Tab } from '../../../../shared/ui/tab';
import type { ColorTab } from '../color.types';
import { useColorTabs } from './useColorTabs';

interface ColorTabsProps { initialTab: ColorTab; primitive: ReactNode; semantic: ReactNode }

/** 패널 콘텐츠는 서버에서 전달받고 선택 동작만 클라이언트에서 관리해요. */
export function ColorTabs({ initialTab, primitive, semantic }: ColorTabsProps) {
  const { activeTab, listRef, id, select, onKeyDown } = useColorTabs(initialTab);
  return <>
    <div aria-label="Color 종류" className="foundation-color-tabs" onKeyDown={onKeyDown} ref={listRef} role="tablist">
      {(['primitive', 'semantic'] as const).map(value => <Tab
        active={activeTab === value}
        aria-controls={`${id}-${value}-panel`}
        id={`${id}-${value}-tab`}
        key={value}
        label={value === 'primitive' ? 'Primitive' : 'Semantic'}
        onActiveChange={active => { if (active) select(value); }}
        tabIndex={activeTab === value ? 0 : -1}
      />)}
      <span aria-hidden="true" className="foundation-color-tabs__line" />
    </div>
    <div aria-labelledby={`${id}-primitive-tab`} hidden={activeTab !== 'primitive'} id={`${id}-primitive-panel`} role="tabpanel" tabIndex={0}>{primitive}</div>
    <div aria-labelledby={`${id}-semantic-tab`} hidden={activeTab !== 'semantic'} id={`${id}-semantic-panel`} role="tabpanel" tabIndex={0}>{semantic}</div>
  </>;
}
