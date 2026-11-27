'use client';

import { useState } from 'react';
import { NavigationBar } from '../../../../shared/ui/navigation-bar';

export function NavigationBarBasicPreview() {
  const items = ['홈', '검색', '내 정보'].map((label, index) => ({
    value: String(index), label,
    outlinedIcon: <span aria-hidden="true">○</span>,
    filledIcon: <span aria-hidden="true">●</span>,
  }));
  return (
    <NavigationBar aria-label="주요 화면" items={items} />
  );
}

export function NavigationBarControlledPreview() {
  const [page, setPage] = useState("0");
  const items = ['홈', '검색', '내 정보'].map((label, index) => ({
    value: String(index), label,
    outlinedIcon: <span aria-hidden="true">○</span>,
    filledIcon: <span aria-hidden="true">●</span>,
  }));
  return (
    <NavigationBar aria-label="주요 화면" items={items} value={page} onValueChange={setPage} />
  );
}

