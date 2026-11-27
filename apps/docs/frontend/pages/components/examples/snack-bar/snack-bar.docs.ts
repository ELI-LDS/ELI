import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const snackBarDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "메시지와 액션 문구를 전달해요. 이 기본 미리보기는 `duration={0}`으로 유지해요.",
    code: `<SnackBar duration={0} action="확인">저장했어요.</SnackBar>`,
  },
  {
    id: "open", section: 'interactions', property: 'open', relatedProperties: ['onOpenChange'],
    title: "표시와 닫기",
    install: ["button"],
    description: "`open`·`onOpenChange`를 연결해 자동 닫힘을 반영해요. 액션 버튼의 닫기는 `onAction`에 직접 연결해요.",
    code: `<Button icon={null} onClick={() => setOpen(true)}>스낵바 띄우기</Button><SnackBar open={open} onOpenChange={setOpen} duration={5000} action="닫기" onAction={() => setOpen(false)}>저장했어요.</SnackBar>`,
    fullCode: `import { useState } from 'react';
import { Button } from './components/ui/button';
import { SnackBar } from './components/ui/snack-bar';

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <div><Button icon={null} onClick={() => setOpen(true)}>스낵바 띄우기</Button><SnackBar open={open} onOpenChange={setOpen} duration={5000} action="닫기" onAction={() => setOpen(false)}>저장했어요.</SnackBar></div>
  );
}`,
  },
] as const satisfies readonly DocExampleDefinition[];
