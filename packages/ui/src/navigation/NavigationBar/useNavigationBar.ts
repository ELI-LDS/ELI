import { useState } from 'react';
import type {
  NavigationBarOption,
  NavigationBarProps,
} from './NavigationBar.types.js';

function getFirstItemValue(items: readonly NavigationBarOption[]) {
  return items[0]?.value;
}

interface UseNavigationBarOptions {
  defaultValue: NavigationBarProps['defaultValue'];
  items: NavigationBarProps['items'];
  onValueChange: NavigationBarProps['onValueChange'];
  value: NavigationBarProps['value'];
}

/* 제어·비제어 활성 탭과 선택 결과 전달을 관리해요. */
export function useNavigationBar({
  defaultValue,
  items,
  onValueChange,
  value,
}: UseNavigationBarOptions) {
  /* JavaScript에서 잘못된 빈 배열이 와도 탐색 영역 전체가 렌더링을 중단하지 않아요. */
  const [internalValue, setInternalValue] = useState(
    () => defaultValue ?? getFirstItemValue(items) ?? '',
  );
  const selectedValue = value ?? internalValue;

  /* 제어 여부에 따라 내부 값을 갱신하고 선택 결과를 알려줘요. */
  const selectValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return { selectedValue, selectValue };
}
