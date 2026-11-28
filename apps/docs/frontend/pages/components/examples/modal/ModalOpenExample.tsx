'use client';

import { useState } from 'react';
import { Button } from '../../../../shared/ui/button';
import { Modal } from '../../../../shared/ui/modal';
import type { ModalProps } from '../../../../shared/ui/modal/Modal.types';

/** 실서비스와 같이 트리거를 남겨 닫힌 뒤의 포커스 복귀도 확인해요. */
export function ModalOpenExample({ content }: { content: Pick<ModalProps, 'title' | 'message' | 'subMessage' | 'positiveAction' | 'secondaryAction'> }) {
  const [open, setOpen] = useState(false);
  return <>
    <Button icon={null} onClick={event => { event.currentTarget.focus({ preventScroll: true }); setOpen(true); }}>모달 열기</Button>
    <Modal {...content} onOpenChange={setOpen} open={open} />
  </>;
}
