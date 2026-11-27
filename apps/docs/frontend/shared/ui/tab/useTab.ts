import { useState } from 'react';
import type { MouseEventHandler } from 'react';
import type { TabProps } from './Tab.types';

interface UseTabOptions {
  active: TabProps['active'];
  defaultActive: boolean;
  onActiveChange: TabProps['onActiveChange'];
  onClick: TabProps['onClick'];
}

/* Tab의 제어·비제어 선택 상태와 클릭 전환을 관리해요. */
export function useTab({ active, defaultActive, onActiveChange, onClick }: UseTabOptions) {
  /* active가 없을 때 사용하는 내부 선택 상태예요. */
  const [internalActive, setInternalActive] = useState(defaultActive);
  const isActive = active ?? internalActive;

  /* 외부 클릭이 취소되지 않았을 때 선택 상태를 반대로 전환해요. */
  const handleClick: MouseEventHandler<HTMLButtonElement> = event => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const nextActive = !isActive;
    if (active === undefined) setInternalActive(nextActive);
    onActiveChange?.(nextActive);
  };

  return { handleClick, isActive };
}
