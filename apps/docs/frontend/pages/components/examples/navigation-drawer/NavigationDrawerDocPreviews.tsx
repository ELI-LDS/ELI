'use client';

import { useState } from 'react';
import { NavigationDrawer } from '../../../../shared/ui/navigation-drawer';
import { NavigationDrawerCategory } from '../../../../shared/ui/navigation-drawer-category';
import { NavigationDrawerMenu } from '../../../../shared/ui/navigation-drawer-menu';

export function NavigationDrawerBasicPreview() {
  return (
    <NavigationDrawer aria-label="서비스 메뉴">
      <NavigationDrawerCategory label="서비스" />
      <NavigationDrawerMenu value="home" label="홈" />
      <NavigationDrawerMenu value="learning" label="학습" subItems={[
        { value: 'courses', label: '내 강의' },
        { value: 'saved', label: '저장한 강의' },
      ]} />
    </NavigationDrawer>
  );
}

export function NavigationDrawerControlledPreview() {
  const [page, setPage] = useState("");
  return (
    <NavigationDrawer aria-label="서비스 메뉴" value={page} onValueChange={setPage}>
      <NavigationDrawerCategory label="서비스" />
      <NavigationDrawerMenu value="home" label="홈" />
      <NavigationDrawerMenu value="learning" label="학습" subItems={[
        { value: 'courses', label: '내 강의' },
        { value: 'saved', label: '저장한 강의' },
      ]} />
    </NavigationDrawer>
  );
}

