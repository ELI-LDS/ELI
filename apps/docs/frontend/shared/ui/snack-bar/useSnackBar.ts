import { useCallback, useState } from 'react';

interface UseSnackBarOptions {
  open: boolean | undefined;
  defaultOpen: boolean | undefined;
  onOpenChange: ((open: boolean) => void) | undefined;
}

/** 표시 상태만 관리해요. 제어 방식에서는 부모가 다음 상태를 반영해요. */
export function useSnackBar({ open, defaultOpen = true, onOpenChange }: UseSnackBarOptions) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;
  const close = useCallback(() => {
    if (open === undefined) setInternalOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange, open]);

  return { close, isOpen };
}
