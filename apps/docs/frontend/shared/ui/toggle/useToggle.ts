import { useState } from 'react';
import type { MouseEventHandler } from 'react';
import type { ToggleProps } from './Toggle.types';

/* Toggle 동작에 필요한 공개 속성만 받아요. */
interface UseToggleOptions {
  checked: ToggleProps['checked'];
  defaultChecked: boolean;
  onCheckedChange: ToggleProps['onCheckedChange'];
  onClick: ToggleProps['onClick'];
}

/* 제어·비제어 상태와 클릭 상호작용을 관리해요. */
export function useToggle({
  checked,
  defaultChecked,
  onCheckedChange,
  onClick,
}: UseToggleOptions) {
  /* 제어하지 않을 때 사용하는 내부 상태 */
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked ?? internalChecked;

  /* 외부 클릭을 먼저 실행하고 취소되지 않았을 때 상태를 변경해요. */
  const handleClick: MouseEventHandler<HTMLButtonElement> = event => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const nextChecked = !isChecked;
    if (checked === undefined) setInternalChecked(nextChecked);
    onCheckedChange?.(nextChecked);
  };

  return { handleClick, isChecked };
}
