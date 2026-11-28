import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const textAreaDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "여러 줄의 내용을 입력할 라벨과 안내 문구를 전달해요.",
    code: `<TextArea label="소개" placeholder="소개를 입력하세요" />`,
  },
  {
    id: "controlled", section: 'interactions', property: 'onChange',
    title: "입력값 연결",
    description: "`onChange`에서 `event.currentTarget.value`를 읽어요.",
    code: `<TextArea label="소개" placeholder="소개를 입력하세요" value={message} onChange={event => setMessage(event.currentTarget.value)} />`,
    fullCode: `import { useState } from 'react';
import { TextArea } from './components/ui/textarea';

export default function Example() {
  const [message, setMessage] = useState("");
  return (
    <TextArea label="소개" placeholder="소개를 입력하세요" value={message} onChange={event => setMessage(event.currentTarget.value)} />
  );
}`,
  },
  {
    id: "disabled", section: 'interactions', property: 'disabled',
    title: "비활성화",
    description: "입력할 수 없는 상태에는 `disabled`를 전달해요.",
    code: `<TextArea label="소개" placeholder="소개를 입력하세요" disabled />`,
  },
] as const satisfies readonly DocExampleDefinition[];
