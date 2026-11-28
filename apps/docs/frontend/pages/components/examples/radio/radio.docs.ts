import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const radioDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "같은 묶음은 `name`을 공유하고 각 항목에 고유한 `value`를 전달해요.",
    code: `<label><Radio name="basic-topic" value="design" defaultChecked />디자인</label><label><Radio name="basic-topic" value="development" />개발</label>`,
  },
  {
    id: "controlled", section: 'interactions', property: 'checked', relatedProperties: ['onChange'],
    title: "선택값 연결",
    description: "하나의 상태값으로 묶음 안의 선택을 관리해요.",
    code: `{["디자인", "개발"].map(value => <label key={value}><Radio name={name} value={value} checked={selected === value} onChange={event => setSelected(event.currentTarget.value)} />{value}</label>)}`,
    fullCode: `import { useId, useState } from 'react';
import { Radio } from './components/ui/radio';

export default function Example() {
  const name = useId();
  const [selected, setSelected] = useState("디자인");
  return (
    <div>{["디자인", "개발"].map(value => <label key={value}><Radio name={name} value={value} checked={selected === value} onChange={event => setSelected(event.currentTarget.value)} />{value}</label>)}</div>
  );
}`,
  },
] as const satisfies readonly DocExampleDefinition[];
