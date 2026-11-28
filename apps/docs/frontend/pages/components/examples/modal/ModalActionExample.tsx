'use client';

import { useState } from 'react';
import { Button } from '../../../../shared/ui/button';
import { Modal } from '../../../../shared/ui/modal';

export function ModalActionExample() {
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const handleConfirm = () => { setCompleted(true); };
  return <>
    <Button icon={null} onClick={event => { event.currentTarget.focus({ preventScroll: true }); setOpen(true); }}>{completed ? '완료됨' : '모달 열기'}</Button>
    <Modal message="확인을 누르면 예시 작업을 완료하고 창을 닫아요." onOpenChange={setOpen} onPositiveAction={handleConfirm} open={open} positiveAction="완료" secondaryAction="취소" subMessage={null} title="작업을 완료할까요?" />
  </>;
}
