import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';

/** 연결된 패널이 항상 하나 선택되고 키보드 포커스와 선택이 함께 이동하게 해요. */
export function useTabExample() {
  const [tab, setTab] = useState(0);
  const panelId = useId();
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - tab;
    setTab(next);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };
  return { tab, setTab, panelId, onKeyDown };
}
