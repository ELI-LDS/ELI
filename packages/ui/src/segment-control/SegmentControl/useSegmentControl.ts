import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import type {
  SegmentControlOption,
  SegmentControlProps,
} from './SegmentControl.types.js';

function getFirstOptionValue(options: readonly SegmentControlOption[]) {
  return options[0]?.value;
}

interface UseSegmentControlOptions {
  defaultValue: SegmentControlProps['defaultValue'];
  onValueChange: SegmentControlProps['onValueChange'];
  options: SegmentControlProps['options'];
  value: SegmentControlProps['value'];
}

/* 선택 상태와 라디오 그룹의 키보드 이동을 관리해요. */
export function useSegmentControl({
  defaultValue,
  onValueChange,
  options,
  value,
}: UseSegmentControlOptions) {
  /* JavaScript나 Storybook Control에서 잘못된 빈 배열이 와도 렌더링을 중단하지 않아요. */
  const [internalValue, setInternalValue] = useState(
    () => defaultValue ?? getFirstOptionValue(options) ?? '',
  );
  const selectedValue = value ?? internalValue;
  const selectedIndex = options.findIndex(option => option.value === selectedValue);
  const focusableIndex = selectedIndex >= 0 ? selectedIndex : 0;

  /* 제어 여부에 따라 내부 값을 갱신하고 선택 결과를 알려줘요. */
  const selectValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  /* 라디오 그룹 관례에 맞게 방향키·Home·End로 선택과 포커스를 함께 옮겨요. */
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % options.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + options.length) % options.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = options.length - 1;
    }

    if (nextIndex === undefined) return;

    event.preventDefault();
    const nextOption = options[nextIndex];
    if (!nextOption) return;
    selectValue(nextOption.value);
    const segmentButtons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
      '[role="radio"]',
    );
    segmentButtons?.[nextIndex]?.focus();
  };

  return { focusableIndex, handleKeyDown, selectedValue, selectValue };
}
