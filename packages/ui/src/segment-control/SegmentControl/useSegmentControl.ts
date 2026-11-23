import type { KeyboardEvent } from 'react';
import { useSelection } from '../../shared/useSelection.js';
import type { SegmentControlProps } from './SegmentControl.types.js';

interface UseSegmentControlOptions {
  defaultValue: SegmentControlProps['defaultValue'];
  disabled: boolean;
  onValueChange: SegmentControlProps['onValueChange'];
  options: SegmentControlProps['options'];
  value: SegmentControlProps['value'];
}

/* 라디오 그룹의 키보드 이동은 사용 가능한 옵션만 순회해요. */
export function useSegmentControl(settings: UseSegmentControlOptions) {
  const { disabled, options } = settings;
  const { selectedValue, selectValue } = useSelection(settings);
  const enabledIndices = options.flatMap((option, index) => option.disabled ? [] : [index]);
  const selectedIndex = options.findIndex(option => option.value === selectedValue);
  const focusableIndex = !disabled && enabledIndices.includes(selectedIndex)
    ? selectedIndex : disabled ? -1 : (enabledIndices[0] ?? -1);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (disabled || !enabledIndices.length) return;
    const current = enabledIndices.indexOf(index);
    let next: number | undefined;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = enabledIndices[(current + 1) % enabledIndices.length];
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = enabledIndices[(current - 1 + enabledIndices.length) % enabledIndices.length];
    } else if (event.key === 'Home') next = enabledIndices[0];
    else if (event.key === 'End') next = enabledIndices.at(-1);
    if (next === undefined) return;
    event.preventDefault();
    const nextOption = options[next];
    if (!nextOption) return;
    selectValue(nextOption.value);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
  };

  return { focusableIndex, handleKeyDown, selectedValue, selectValue };
}
