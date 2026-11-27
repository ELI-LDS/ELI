import { useCallback, useState } from 'react';

interface UseNavigationDrawerOptions {
  defaultValue: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
  value: string | undefined;
}

/** Drawer 전체에서 하나의 메뉴만 선택되도록 제어·비제어 값을 관리해요. */
export function useNavigationDrawer({
  defaultValue,
  onValueChange,
  value,
}: UseNavigationDrawerOptions) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const selectValue = useCallback((nextValue: string) => {
    if (!isControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }, [isControlled, onValueChange]);

  return {
    selectedValue,
    selectValue,
  };
}
