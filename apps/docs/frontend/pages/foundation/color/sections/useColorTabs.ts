import { useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { ColorTab } from '../color.types';
import { useActiveColorTab } from './useActiveColorTab';

const tabValues: readonly ColorTab[] = ['primitive', 'semantic'];

/** 서버에서 준비한 두 패널을 URL·키보드와 연결하고 탭 전환 시 재요청하지 않아요. */
export function useColorTabs(initialTab: ColorTab) {
  const activeTab = useActiveColorTab(initialTab);
  const listRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const select = (value: ColorTab) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    if (activeTab !== value) url.hash = '';
    window.history.replaceState(null, '', url);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = tabValues.indexOf(activeTab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + 2) % 2;
    const value = tabValues[next];
    if (!value) return;
    select(value);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };
  return { activeTab, listRef, id, select, onKeyDown };
}
