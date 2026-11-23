import { useSelection } from '../../shared/useSelection.js';
import type { NavigationBarProps } from './NavigationBar.types.js';

interface UseNavigationBarOptions {
  defaultValue: NavigationBarProps['defaultValue'];
  items: NavigationBarProps['items'];
  onValueChange: NavigationBarProps['onValueChange'];
  value: NavigationBarProps['value'];
}

/* 선택 상태는 동적 목록을 다루는 공통 Hook과 같은 규칙을 사용해요. */
export function useNavigationBar({ items, ...options }: UseNavigationBarOptions) {
  return useSelection({ ...options, options: items.map(item => ({ value: item.value })) });
}
