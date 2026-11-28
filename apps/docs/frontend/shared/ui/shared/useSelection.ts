import { useCallback, useEffect, useState } from 'react';

interface SelectionOption {
  value: string;
  disabled?: boolean;
}

interface UseSelectionOptions {
  options: readonly SelectionOption[];
  value: string | undefined;
  defaultValue: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
  disabled?: boolean;
}

/** 선택 목록이 바뀌어도 표시 값과 실제 선택을 일치시켜요. 포커스·제스처는 각 Hook이 맡아요. */
export function useSelection({
  options, value, defaultValue, onValueChange, disabled = false,
}: UseSelectionOptions) {
  const firstEnabled = options.find(option => !option.disabled)?.value;
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabled);
  const requestedValue = value === undefined ? internalValue : value;
  const exists = options.some(option => option.value === requestedValue);
  // 제어 값이 목록에 없으면 임의로 다른 항목을 선택하지 않아요.
  const selectedValue = exists ? requestedValue : value === undefined ? firstEnabled : undefined;

  useEffect(() => {
    // 제거된 선택값을 저장해 두었다가 항목 재추가 때 되살리지 않아요.
    if (value === undefined && internalValue !== selectedValue) setInternalValue(selectedValue);
  }, [internalValue, selectedValue, value]);

  const selectValue = useCallback((nextValue: string) => {
    if (disabled || !options.some(option => option.value === nextValue && !option.disabled)) return;
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }, [disabled, onValueChange, options, value]);

  return { selectedValue, selectValue };
}
