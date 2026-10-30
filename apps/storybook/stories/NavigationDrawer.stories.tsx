import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '@/packages/ui/src/divider/Divider/Divider.js';
import { HomeFilledIcon } from '@/packages/ui/src/icon/HomeFilledIcon.js';
import { HomeOutlinedIcon } from '@/packages/ui/src/icon/HomeOutlinedIcon.js';
import { NavigationDrawer } from '@/packages/ui/src/navigation/NavigationDrawer/NavigationDrawer.js';
import { NavigationDrawerMenu } from '@/packages/ui/src/navigation/NavigationDrawerMenu/NavigationDrawerMenu.js';

interface SubMenuDraft {
  id: number;
  label: string;
}

interface MainMenuDraft {
  id: number;
  label: string;
  subItems: SubMenuDraft[];
}

const initialMenus: MainMenuDraft[] = [
  { id: 1, label: '홈', subItems: [] },
  {
    id: 2,
    label: '학습',
    subItems: [
      { id: 3, label: '내 강의' },
      { id: 4, label: '최근 본 강의' },
    ],
  },
  { id: 5, label: '설정', subItems: [] },
];

const editorButtonStyle = {
  padding: '6px 10px',
  border: '1px solid #c4cedc',
  borderRadius: 6,
  background: '#fff',
  cursor: 'pointer',
} as const;

function NavigationDrawerEditor({ ariaLabel }: { ariaLabel: string }) {
  const [menus, setMenus] = useState(initialMenus);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const nextId = useRef(6);

  const updateMainLabel = (menuId: number, label: string) => {
    setMenus(current => current.map(menu => (
      menu.id === menuId ? { ...menu, label } : menu
    )));
  };

  const addMainMenu = () => {
    const id = nextId.current++;
    setMenus(current => [
      ...current,
      { id, label: `메뉴 ${current.length + 1}`, subItems: [] },
    ]);
  };

  const removeMainMenu = (menuId: number) => {
    setMenus(current => current.filter(menu => menu.id !== menuId));
    setSelectedValue(current => (
      current?.startsWith(`main-${menuId}`) || current?.startsWith(`sub-${menuId}-`)
        ? null
        : current
    ));
  };

  const addSubMenu = (menuId: number) => {
    const id = nextId.current++;
    setMenus(current => current.map(menu => (
      menu.id === menuId
        ? {
            ...menu,
            subItems: [
              ...menu.subItems,
              { id, label: `하위 메뉴 ${menu.subItems.length + 1}` },
            ],
          }
        : menu
    )));
  };

  const updateSubLabel = (menuId: number, subId: number, label: string) => {
    setMenus(current => current.map(menu => (
      menu.id === menuId
        ? {
            ...menu,
            subItems: menu.subItems.map(subItem => (
              subItem.id === subId ? { ...subItem, label } : subItem
            )),
          }
        : menu
    )));
  };

  const removeSubMenu = (menuId: number, subId: number) => {
    setMenus(current => current.map(menu => (
      menu.id === menuId
        ? {
            ...menu,
            subItems: menu.subItems.filter(subItem => subItem.id !== subId),
          }
        : menu
    )));
    setSelectedValue(current => (
      current === `sub-${menuId}-${subId}` ? null : current
    ));
  };

  return (
    <div
      style={{
        alignItems: 'start',
        display: 'grid',
        gap: 32,
        gridTemplateColumns: '256px 360px',
        minWidth: 648,
      }}
    >
      <NavigationDrawer
        aria-label={ariaLabel}
        onValueChange={setSelectedValue}
        value={selectedValue ?? ''}
      >
        {menus.map(menu => {
          return (
            <NavigationDrawerMenu
              defaultExpanded={menu.subItems.length > 0}
              filledIcon={<HomeFilledIcon />}
              key={`${menu.id}-${menu.subItems.length > 0}`}
              label={menu.label}
              outlinedIcon={<HomeOutlinedIcon />}
              subItems={menu.subItems.map(subItem => ({
                label: subItem.label,
                value: `sub-${menu.id}-${subItem.id}`,
              }))}
              value={`main-${menu.id}`}
            />
          );
        })}
      </NavigationDrawer>

      <section style={{ display: 'grid', gap: 16, width: 360 }}>
        <div>
          <h3 style={{ margin: '0 0 4px' }}>메뉴 구성</h3>
          <p style={{ color: '#4b5668', margin: 0 }}>
            메뉴와 하위 메뉴를 원하는 만큼 추가하고 라벨을 수정해요. 처음에는 선택된 메뉴가 없어요.
          </p>
        </div>

        {menus.map((menu, menuIndex) => (
          <div
            key={menu.id}
            style={{
              border: '1px solid #d9e1ec',
              borderRadius: 8,
              display: 'grid',
              gap: 12,
              padding: 12,
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                aria-label={`${menuIndex + 1}번째 주 메뉴 라벨`}
                onChange={event => updateMainLabel(menu.id, event.target.value)}
                style={{ flex: 1, minWidth: 0, padding: 8 }}
                value={menu.label}
              />
              <button
                onClick={() => removeMainMenu(menu.id)}
                style={editorButtonStyle}
                type="button"
              >
                메뉴 삭제
              </button>
            </div>

            {menu.subItems.map((subItem, subIndex) => (
              <div key={subItem.id} style={{ display: 'flex', gap: 8, paddingLeft: 20 }}>
                <input
                  aria-label={`${menuIndex + 1}번째 메뉴의 ${subIndex + 1}번째 하위 메뉴 라벨`}
                  onChange={event => updateSubLabel(menu.id, subItem.id, event.target.value)}
                  style={{ flex: 1, minWidth: 0, padding: 8 }}
                  value={subItem.label}
                />
                <button
                  onClick={() => removeSubMenu(menu.id, subItem.id)}
                  style={editorButtonStyle}
                  type="button"
                >
                  하위 메뉴 삭제
                </button>
              </div>
            ))}

            <button
              onClick={() => addSubMenu(menu.id)}
              style={editorButtonStyle}
              type="button"
            >
              하위 메뉴 추가
            </button>
          </div>
        ))}

        <button onClick={addMainMenu} style={editorButtonStyle} type="button">
          주 메뉴 추가
        </button>
      </section>
    </div>
  );
}

const meta = {
  title: '컴포넌트/NavigationDrawer',
  component: NavigationDrawer,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': '서비스 메뉴',
    children: null,
  },
  argTypes: {
    'aria-label': {
      name: '탐색 영역 설명',
      control: 'text',
      description: 'Navigation Drawer가 어떤 탐색 영역인지 화면 낭독기가 읽을 수 있게 설명해요.',
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
} satisfies Meta<typeof NavigationDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 실제 라벨로 Drawer의 메뉴·하위 메뉴·상태 조합을 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <NavigationDrawer aria-label="서비스 메뉴" defaultValue="my-course">
      <NavigationDrawerMenu
        filledIcon={<HomeFilledIcon />}
        label="홈"
        outlinedIcon={<HomeOutlinedIcon />}
        value="home"
      />
      <NavigationDrawerMenu
        defaultExpanded
        filledIcon={<HomeFilledIcon />}
        label="학습"
        outlinedIcon={<HomeOutlinedIcon />}
        subItems={[
          { label: '내 강의', value: 'my-course' },
          { label: '최근 본 강의', value: 'recent-course' },
        ]}
        value="learning"
      />
      <Divider />
      <NavigationDrawerMenu
        filledIcon={<HomeFilledIcon />}
        label="커뮤니티"
        outlinedIcon={<HomeOutlinedIcon />}
        value="community"
      />
      <NavigationDrawerMenu
        filledIcon={<HomeFilledIcon />}
        label="설정"
        outlinedIcon={<HomeOutlinedIcon />}
        value="settings"
      />
      <Divider />
      <NavigationDrawerMenu
        filledIcon={<HomeFilledIcon />}
        label="도움말"
        outlinedIcon={<HomeOutlinedIcon />}
        value="help"
      />
    </NavigationDrawer>
  ),
};

/* 메뉴와 하위 메뉴를 원하는 만큼 구성하고 선택 동작을 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  parameters: { layout: 'padded' },
  render: args => <NavigationDrawerEditor ariaLabel={args['aria-label']} />,
};
