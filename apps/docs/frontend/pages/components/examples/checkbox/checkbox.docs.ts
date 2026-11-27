import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const checkboxDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "라벨로 어떤 항목을 선택하는지 알려줘요.",
    code: `<label><Checkbox />이용약관에 동의해요.</label>`,
  },
  {
    id: "controlled", section: 'interactions', property: 'checked', relatedProperties: ['onChange'],
    title: "선택값 연결",
    description: "`onChange`에서 입력 요소의 `checked`를 읽어 같은 상태에 반영해요.",
    code: `<label><Checkbox checked={agreed} onChange={event => setAgreed(event.currentTarget.checked)} />이용약관에 동의해요.</label>`,
    fullCode: `import { useState } from 'react';
import { Checkbox } from './components/ui/checkbox';

export default function Example() {
  const [agreed, setAgreed] = useState(false);
  return (
    <label><Checkbox checked={agreed} onChange={event => setAgreed(event.currentTarget.checked)} />이용약관에 동의해요.</label>
  );
}`,
  },
  {
    id: "disabled", section: 'interactions', property: 'disabled',
    title: "비활성화",
    description: "변경할 수 없는 선택 항목에는 `disabled`를 전달해요.",
    code: `<Checkbox aria-label="변경할 수 없는 항목" defaultChecked disabled />`,
  },
] as const satisfies readonly DocExampleDefinition[];
