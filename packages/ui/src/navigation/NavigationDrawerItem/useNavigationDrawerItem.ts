import { useId, useState } from 'react';
import type { MouseEventHandler } from 'react';

interface UseNavigationDrawerItemOptions {
  defaultExpanded: boolean;
  expandable: boolean;
  expanded: boolean | undefined;
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
  onExpandedChange: ((expanded: boolean) => void) | undefined;
}

/** Main Menu의 제어·비제어 펼침 상태와 하위 메뉴 연결 ID를 관리해요. */
export function useNavigationDrawerItem({
  defaultExpanded,
  expandable,
  expanded,
  onClick,
  onExpandedChange,
}: UseNavigationDrawerItemOptions) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const subItemsId = useId();
  const isControlled = expanded !== undefined;
  const isExpanded = isControlled ? expanded : internalExpanded;

  const handleClick: MouseEventHandler<HTMLButtonElement> = event => {
    onClick?.(event);

    if (event.defaultPrevented || !expandable) return;

    const nextExpanded = !isExpanded;
    if (!isControlled) setInternalExpanded(nextExpanded);
    onExpandedChange?.(nextExpanded);
  };

  return {
    handleClick,
    isExpanded,
    subItemsId,
  };
}
