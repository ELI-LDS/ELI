import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const textFieldDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "한 줄 입력의 라벨과 안내 문구를 전달해요.",
    code: `<TextField label="이메일" placeholder="이메일을 입력하세요" type="email" />`,
  },
  {
    id: "controlled", section: 'interactions', property: 'onChange',
    title: "입력과 지우기 연결",
    description: "`onChange`에 입력값을 연결하면 X 버튼으로 지웠을 때도 같은 상태가 갱신돼요.",
    code: `<TextField label="이메일" placeholder="이메일을 입력하세요" type="email" value={email} onChange={event => setEmail(event.currentTarget.value)} />`,
    fullCode: `import { useState } from 'react';
import { TextField } from './components/ui/text-field';

export default function Example() {
  const [email, setEmail] = useState("");
  return (
    <TextField label="이메일" placeholder="이메일을 입력하세요" type="email" value={email} onChange={event => setEmail(event.currentTarget.value)} />
  );
}`,
  },
  {
    id: "states", section: 'interactions', property: 'state',
    title: "오류·성공·비활성화",
    description: "`state` 중 하나를 선택해요. 입력 칸의 상태가 바뀌어도 라벨의 스타일은 유지돼요.",
    code: `<TextField label="오류" state="error" /><TextField label="성공" state="success" /><TextField label="비활성화" state="disabled" />`,
  },
] as const satisfies readonly DocExampleDefinition[];
