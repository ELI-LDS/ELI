import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const selectDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "`label`·`placeholder`와 옵션 목록을 전달해요.",
    code: `<Select label="분류" placeholder="분류를 선택하세요" options={[{ value: "design", label: "디자인" }, { value: "development", label: "개발" }]} />`,
  },
  {
    id: "controlled", section: 'interactions', property: 'value', relatedProperties: ['onValueChange'],
    title: "선택값 연결",
    description: "`onValueChange`는 선택한 옵션의 `value`를 전달해요.",
    code: `<Select label="분류" placeholder="분류를 선택하세요" options={[{ value: "design", label: "디자인" }, { value: "development", label: "개발" }]} value={value} onValueChange={setValue} />`,
    fullCode: `import { useState } from 'react';
import { Select } from './components/ui/select';

export default function Example() {
  const [value, setValue] = useState("");
  return (
    <Select label="분류" placeholder="분류를 선택하세요" options={[{ value: "design", label: "디자인" }, { value: "development", label: "개발" }]} value={value} onValueChange={setValue} />
  );
}`,
  },
  {
    id: "disabled", section: 'interactions', property: 'disabled',
    title: "비활성화",
    description: "옵션을 선택할 수 없을 때 `disabled`를 전달해요.",
    code: `<Select label="분류" options={[{ value: "design", label: "디자인" }, { value: "development", label: "개발" }]} disabled />`,
  },
] as const satisfies readonly DocExampleDefinition[];
