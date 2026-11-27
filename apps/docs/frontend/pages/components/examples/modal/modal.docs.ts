import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const modalBasicProps = { positiveAction: '확인', secondaryAction: '취소' } as const;
export const modalContentProps = { ...modalBasicProps, title: '변경사항을 저장할까요?', message: '작성한 내용을 저장합니다.', subMessage: '저장 후에도 다시 수정할 수 있어요.' } as const;

const basicCode = `<Modal open={open} onOpenChange={setOpen}
  positiveAction="확인" secondaryAction="취소"
  onPositiveAction={() => setOpen(false)}
/>`;
const contentCode = `<Modal open={open} onOpenChange={setOpen}
  title="변경사항을 저장할까요?"
  message="작성한 내용을 저장합니다."
  subMessage="저장 후에도 다시 수정할 수 있어요."
  positiveAction="확인" secondaryAction="취소"
  onPositiveAction={() => setOpen(false)}
/>`;
const fullExample = (code: string) => `import { useState } from 'react';
import { Button } from './components/ui/button';
import { Modal } from './components/ui/modal';

export default function ModalExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button icon={null} onClick={event => { event.currentTarget.focus({ preventScroll: true }); setOpen(true); }}>모달 열기</Button>
      ${code.replaceAll('\n', '\n      ')}
    </>
  );
}`;

export const modalDocExamples = [
  { id: 'basic', title: '기본 사용', description: '버튼을 눌러 열고 Dim·취소·Escape로 닫아보세요. **확인 버튼은 자동으로 닫히지 않아** 이 예시에서는 닫기를 직접 연결했어요. `open`과 `setOpen`의 연결은 전체 실행 예시에서 확인해요.', code: basicCode, fullCode: fullExample(basicCode) },
  { id: 'content', section: 'properties', property: 'title', relatedProperties: ['message', 'subMessage'], title: '문구 변경', description: 'title·message·subMessage로 제목과 안내를 전달해요. 두 번째 안내가 필요하지 않으면 subMessage={null}로 숨겨요.', code: contentCode, fullCode: fullExample(contentCode) },
  { id: 'actions', section: 'interactions', property: 'onPositiveAction', title: '버튼 동작 연결', description: 'onPositiveAction에서 작업과 닫기를 연결해요. 이 예시는 완료를 누르면 닫히고 열기 버튼이 완료됨으로 바뀌어요. 실제 요청이 있다면 성공한 뒤에 닫아주세요.', code: '<Modal open={open} onOpenChange={setOpen}\n  title="작업을 완료할까요?" message="확인을 누르면 예시 작업을 완료하고 창을 닫아요."\n  subMessage={null} positiveAction="완료" secondaryAction="취소"\n  onPositiveAction={handleConfirm}\n/>', fullCode: `import { useState } from 'react';
import { Button } from './components/ui/button';
import { Modal } from './components/ui/modal';

export default function ModalActionExample() {
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const handleConfirm = () => {
    setCompleted(true);
    setOpen(false);
  };
  return (
    <>
      <Button icon={null} onClick={event => { event.currentTarget.focus({ preventScroll: true }); setOpen(true); }}>
        {completed ? '완료됨' : '모달 열기'}
      </Button>
      <Modal open={open} onOpenChange={setOpen}
        title="작업을 완료할까요?"
        message="확인을 누르면 예시 작업을 완료하고 창을 닫아요."
        subMessage={null} positiveAction="완료" secondaryAction="취소"
        onPositiveAction={handleConfirm}
      />
    </>
  );
}` },
] as const satisfies readonly DocExampleDefinition[];
