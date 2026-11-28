import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const chipDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "`selected`와 `onSelectedChange`를 연결해 선택·해제를 반영해요.",
    code: `<Chip selected={selected} onSelectedChange={setSelected}>디자인</Chip>`,
    fullCode: `import { useState } from 'react';
import { Chip } from './components/ui/chip';

export default function Example() {
  const [selected, setSelected] = useState(false);
  return (
    <Chip selected={selected} onSelectedChange={setSelected}>디자인</Chip>
  );
}`,
  },
  {
    id: "variants", section: 'properties', property: 'variant',
    title: "역할 선택",
    description: "선택은 `selectable`, 별도 필터 화면 열기는 `filter`, 태그 삭제는 `removable`을 사용해요. 생략하면 `selectable`이에요. 세 역할 모두 `add chip` 한 번으로 설치돼요.",
    code: `<Chip variant="selectable">디자인</Chip>
<Chip variant="filter" label="분야" options={[]} />
<Chip variant="removable" onRemove={() => undefined}>디자인</Chip>`,
  },
  {
    id: "multiple", section: 'interactions', property: 'selected', relatedProperties: ['onSelectedChange'],
    title: "복수 선택",
    description: "선택한 값 목록을 관리하면 다른 항목을 유지하며 추가·해제할 수 있어요.",
    code: `{["디자인", "개발", "기획"].map(label => <Chip key={label} selected={selected.includes(label)} onSelectedChange={next => setSelected(previous => next ? [...previous, label] : previous.filter(value => value !== label))}>{label}</Chip>)}`,
    fullCode: `import { useState } from 'react';
import { Chip } from './components/ui/chip';

export default function Example() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div>{["디자인", "개발", "기획"].map(label => <Chip key={label} selected={selected.includes(label)} onSelectedChange={next => setSelected(previous => next ? [...previous, label] : previous.filter(value => value !== label))}>{label}</Chip>)}</div>
  );
}`,
  },
  {
    id: "filter", section: 'interactions', property: 'selectedValues',
    title: "필터와 선택 화면 연결",
    description: "`filter` 유형은 현재 필터 값을 표시하고 선택 화면을 여는 동작을 연결해요. 이 미리보기의 모달·바텀시트는 문서 사이트의 조합 예시예요.",
    code: `<Chip variant="filter" label="성별" options={options}
  selectedValues={selectedValues} onClick={openFilter}
/>`,
    fullCode: `import { Chip } from './components/ui/chip';

export default function Example({ selectedValues, openFilter }: {
  selectedValues: string[];
  openFilter: () => void;
}) {
  const options = [
    { value: 'female', label: '여성' },
    { value: 'male', label: '남성' },
  ];
  return <Chip variant="filter" label="성별" options={options}
    selectedValues={selectedValues} onClick={openFilter} />;
}`,
  },
  {
    id: "remove", section: 'interactions', property: 'onRemove',
    title: "삭제 동작 연결",
    description: "`removable` 유형의 `onRemove`에서 목록이나 표시 상태를 바꿔요.",
    code: `{visible ? <Chip variant="removable" removeLabel="디자인 삭제" onRemove={() => setVisible(false)}>디자인</Chip> : <button type="button" onClick={() => setVisible(true)}>다시 표시</button>}`,
    fullCode: `import { useState } from 'react';
import { Chip } from './components/ui/chip';

export default function Example() {
  const [visible, setVisible] = useState(true);
  return (
    <div>{visible ? <Chip variant="removable" removeLabel="디자인 삭제" onRemove={() => setVisible(false)}>디자인</Chip> : <button type="button" onClick={() => setVisible(true)}>다시 표시</button>}</div>
  );
}`,
  },
] as const satisfies readonly DocExampleDefinition[];
