'use client';

import { useState } from 'react';
import { NavigationBarGlass } from '../../../../shared/ui/navigation-bar-glass';

export function NavigationBarGlassBasicPreview() {
  const items = ['홈', '검색', '내 정보'].map((label, index) => ({
    value: String(index), label,
    outlinedIcon: <span aria-hidden="true">○</span>,
    filledIcon: <span aria-hidden="true">●</span>,
  }));
  return (
    <NavigationBarGlass aria-label="주요 화면" items={items} />
  );
}

export function NavigationBarGlassControlledPreview() {
  const [page, setPage] = useState("0");
  const items = ['홈', '검색', '내 정보'].map((label, index) => ({
    value: String(index), label,
    outlinedIcon: <span aria-hidden="true">○</span>,
    filledIcon: <span aria-hidden="true">●</span>,
  }));
  return (
    <NavigationBarGlass aria-label="주요 화면" items={items} value={page} onValueChange={setPage} />
  );
}

