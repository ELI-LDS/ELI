import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const tabDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "개별 탭의 활성 상태를 표시해요. 탭 그룹의 단일 선택과 패널 연결은 앱에서 구성해요.",
    code: `<div role="tablist" aria-label="강의 보기">
  <Tab label="내 강의" />
</div>`,
  },
  {
    id: "panels", section: 'interactions', property: 'active', relatedProperties: ['onActiveChange'],
    title: "탭과 패널 연결",
    description: "하나의 선택값으로 패널과 키보드 이동을 함께 연결해요. 방향키·Home·End를 지원하는 전체 실행 예시를 확인해요.",
    code: `<Tab label="1번 탭" active={tab === 0}
  onActiveChange={active => { if (active) setTab(0); }}
/>
<Tab label="2번 탭" active={tab === 1}
  onActiveChange={active => { if (active) setTab(1); }}
/>`,
    fullCode: `import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Tab } from './components/ui/tab';

/** 연결된 패널이 항상 하나 선택되고 키보드 포커스와 선택이 함께 이동하게 해요. */
function useTabExample() {
  const [tab, setTab] = useState(0);
  const panelId = useId();
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - tab;
    setTab(next);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };
  return { tab, setTab, panelId, onKeyDown };
}

export default function Example() {
  const { tab, setTab, panelId, onKeyDown } = useTabExample();
  return <div>
    <div aria-label="예시 콘텐츠" onKeyDown={onKeyDown} role="tablist">
      {[0, 1].map(index => <Tab
        active={tab === index}
        aria-controls={panelId}
        id={\`\${panelId}-\${index}\`}
        key={index}
        label={\`\${index + 1}번 탭\`}
        onActiveChange={active => { if (active) setTab(index); }}
        tabIndex={tab === index ? 0 : -1}
      />)}
    </div>
    <p aria-labelledby={\`\${panelId}-\${tab}\`} className="eli-typo-body-small" id={panelId} role="tabpanel">
      {tab + 1}번 탭을 누르면 보이는 콘텐츠입니다. {2 - tab}번 탭을 누르면 콘텐츠가 전환됩니다.
    </p>
  </div>;
}
`,
  },
] as const satisfies readonly DocExampleDefinition[];
