import { useState } from 'react';
import type { MouseEventHandler } from 'react';
import type { ModalProps } from './Modal.types';

interface UseModalOptions {
  open: ModalProps['open'];
  defaultOpen: boolean;
  onOpenChange: ModalProps['onOpenChange'];
  onSecondaryAction: ModalProps['onSecondaryAction'];
}

/** 외부 제어 여부와 닫기 요청만 관리해 포커스·DOM 처리는 분리해요. */
export function useModal({ open, defaultOpen, onOpenChange, onSecondaryAction }: UseModalOptions) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;
  const close = () => {
    if (open === undefined) setInternalOpen(false);
    onOpenChange?.(false);
  };
  const handleSecondaryAction: MouseEventHandler<HTMLButtonElement> = event => {
    onSecondaryAction?.(event);
    if (!event.defaultPrevented) close();
  };
  return { close, handleSecondaryAction, isOpen };
}
