import { createContext, useContext } from 'react';

interface NavigationDrawerContextValue {
  selectedValue: string | undefined;
  selectValue: (value: string) => void;
}

export const NavigationDrawerContext = createContext<NavigationDrawerContextValue | null>(null);

/** Menu가 Drawer의 단일 선택값을 사용하도록 같은 탐색 영역의 Context를 연결해요. */
export function useNavigationDrawerContext() {
  const context = useContext(NavigationDrawerContext);

  if (context === null) {
    throw new Error('NavigationDrawerMenu는 NavigationDrawer 안에서 사용해야 해요.');
  }

  return context;
}
