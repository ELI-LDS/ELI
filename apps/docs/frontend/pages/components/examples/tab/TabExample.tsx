'use client';

import { Tab } from '../../../../shared/ui/tab';
import { useTabExample } from './useTabExample';

export function TabExample() {
  const { tab, setTab, panelId, onKeyDown } = useTabExample();
  return <div className="docs-demo__narrow">
    <div aria-label="예시 콘텐츠" className="docs-demo__tabs" onKeyDown={onKeyDown} role="tablist">
      {[0, 1].map(index => <Tab
        active={tab === index}
        aria-controls={panelId}
        id={`${panelId}-${index}`}
        key={index}
        label={`${index + 1}번 탭`}
        onActiveChange={active => { if (active) setTab(index); }}
        tabIndex={tab === index ? 0 : -1}
      />)}
    </div>
    <p aria-labelledby={`${panelId}-${tab}`} className="eli-typo-body-small" id={panelId} role="tabpanel">
      {tab + 1}번 탭을 누르면 보이는 콘텐츠입니다. {2 - tab}번 탭을 누르면 콘텐츠가 전환됩니다.
    </p>
  </div>;
}
