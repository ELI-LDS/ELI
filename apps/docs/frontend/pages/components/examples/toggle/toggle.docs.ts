import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const toggleDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "설정을 켜거나 끄는 동작을 설명하는 `aria-label`을 전달해요.",
    code: `<Toggle aria-label="알림 받기" />`,
  },
  {
    id: "controlled", section: 'interactions', property: 'checked', relatedProperties: ['onCheckedChange'],
    title: "설정값 연결",
    description: "`onCheckedChange`가 전달하는 boolean을 설정 상태에 반영해요.",
    code: `<Toggle aria-label="알림 받기" checked={enabled} onCheckedChange={setEnabled} />`,
    fullCode: `import { useState } from 'react';
import { Toggle } from './components/ui/toggle';

export default function Example() {
  const [enabled, setEnabled] = useState(false);
  return (
    <Toggle aria-label="알림 받기" checked={enabled} onCheckedChange={setEnabled} />
  );
}`,
  },
  {
    id: "disabled", section: 'interactions', property: 'disabled',
    title: "비활성화",
    description: "변경할 수 없는 설정에는 `disabled`를 전달해요.",
    code: `<Toggle aria-label="알림 받기" defaultChecked disabled />`,
  },
] as const satisfies readonly DocExampleDefinition[];
