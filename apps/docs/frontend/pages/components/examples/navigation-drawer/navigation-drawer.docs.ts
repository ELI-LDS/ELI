import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const navigationDrawerDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "카테고리·주 메뉴·하위 메뉴를 조립해요. 하위 메뉴가 있는 주 메뉴를 누르면 펼치거나 접어요.",
    code: `<NavigationDrawer aria-label="서비스 메뉴">
  <NavigationDrawerCategory label="서비스" />
  <NavigationDrawerMenu value="home" label="홈" />
  <NavigationDrawerMenu value="learning" label="학습" subItems={[
    { value: 'courses', label: '내 강의' },
    { value: 'saved', label: '저장한 강의' },
  ]} />
</NavigationDrawer>`,
    install: ["navigation-drawer"],
    installStatus: 'planned',
    imports: ["import { NavigationDrawerCategory } from './components/ui/navigation-drawer-category';", "import { NavigationDrawerMenu } from './components/ui/navigation-drawer-menu';"],
  },
  {
    id: "controlled", section: 'interactions', property: 'value', relatedProperties: ['onValueChange'],
    title: "선택값 연결",
    description: "선택 상태는 `value`·`onValueChange`로 관리하고 실제 이동 동작은 사용하는 앱에 연결해요.",
    code: `<NavigationDrawer aria-label="서비스 메뉴" value={page} onValueChange={setPage}>
  <NavigationDrawerCategory label="서비스" />
  <NavigationDrawerMenu value="home" label="홈" />
  <NavigationDrawerMenu value="learning" label="학습" subItems={[
    { value: 'courses', label: '내 강의' },
    { value: 'saved', label: '저장한 강의' },
  ]} />
</NavigationDrawer>`,
    fullCode: `import { useState } from 'react';
import { NavigationDrawer } from './components/ui/navigation-drawer';
import { NavigationDrawerCategory } from './components/ui/navigation-drawer-category';
import { NavigationDrawerMenu } from './components/ui/navigation-drawer-menu';

export default function Example() {
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
}`,
  },
] as const satisfies readonly DocExampleDefinition[];
