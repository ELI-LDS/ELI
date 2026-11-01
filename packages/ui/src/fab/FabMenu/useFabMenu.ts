import { useCallback, useState } from 'react';

interface UseFabMenuOptions {
  defaultExpanded: boolean;
  expanded: boolean | undefined;
  onExpandedChange: ((expanded: boolean) => void) | undefined;
}

/** FAB Menu의 제어·비제어 열림 상태와 전환 동작만 관리해요. */
export function useFabMenu({
  defaultExpanded,
  expanded,
  onExpandedChange,
}: UseFabMenuOptions) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = expanded !== undefined;
  const isExpanded = isControlled ? expanded : internalExpanded;

  const setExpanded = useCallback((nextExpanded: boolean) => {
    if (!isControlled) setInternalExpanded(nextExpanded);
    onExpandedChange?.(nextExpanded);
  }, [isControlled, onExpandedChange]);

  const toggleExpanded = useCallback(() => {
    setExpanded(!isExpanded);
  }, [isExpanded, setExpanded]);

  const closeMenu = useCallback(() => {
    setExpanded(false);
  }, [setExpanded]);

  return { closeMenu, isExpanded, toggleExpanded };
}
