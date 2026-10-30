import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeFilledIcon } from '@/packages/ui/src/icon/HomeFilledIcon.js';
import { HomeOutlinedIcon } from '@/packages/ui/src/icon/HomeOutlinedIcon.js';
import { NavigationDrawer } from '@/packages/ui/src/navigation/NavigationDrawer/NavigationDrawer.js';
import { NavigationDrawerMenu } from '@/packages/ui/src/navigation/NavigationDrawerMenu/NavigationDrawerMenu.js';

const defaultSubItems = [
  { label: '내 강의', value: 'my-course' },
  { label: '최근 본 강의', value: 'recent-course' },
] as const;

const meta = {
  title: '컴포넌트/NavigationDrawerMenu',
  component: NavigationDrawerMenu,
  parameters: { layout: 'centered' },
  args: {
    defaultExpanded: true,
    filledIcon: <HomeFilledIcon />,
    label: '학습',
    outlinedIcon: <HomeOutlinedIcon />,
    subItems: defaultSubItems,
    value: 'learning',
  },
  argTypes: {
    value: {
      name: '주 메뉴 값',
      control: 'text',
      description: '주 메뉴를 구분하고 선택 상태를 연결할 고유 값이에요.',
    },
    label: {
      name: '주 메뉴 라벨',
      control: 'text',
      description: '주 메뉴에 표시할 한 줄 라벨이에요.',
    },
    subItems: {
      name: '하위 메뉴 목록',
      control: 'object',
      description: '`value`와 `label`로 구성한 하위 메뉴 목록이에요.',
    },
    defaultExpanded: {
      name: '처음 펼침',
      control: 'boolean',
      description: '제어하지 않는 주 메뉴가 처음 열려 있을지 정해요.',
    },
    expanded: { table: { disable: true } },
    outlinedIcon: { table: { disable: true } },
    filledIcon: { table: { disable: true } },
    onClick: {
      name: '주 메뉴 선택 동작',
      action: 'main-menu-click',
      description: '하위 메뉴가 없는 주 메뉴를 선택했을 때 실행해요. 하위 메뉴가 있으면 펼침 동작만 실행해요.',
    },
    onSubItemClick: {
      name: '하위 메뉴 선택 동작',
      action: 'sub-menu-click',
      description: '하위 메뉴를 선택했을 때 해당 값과 클릭 이벤트를 전달해요.',
    },
    onExpandedChange: {
      name: '펼침 변경 동작',
      action: 'expanded-change',
      description: '주 메뉴가 열리거나 닫힐 때 다음 상태를 전달해요.',
    },
    className: { table: { disable: true } },
  },
  render: args => (
    <NavigationDrawer aria-label="메뉴 묶음 예시">
      <NavigationDrawerMenu
        key={`${args.value}-${args.defaultExpanded}`}
        {...args}
      />
    </NavigationDrawer>
  ),
} satisfies Meta<typeof NavigationDrawerMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 주 메뉴와 연결된 하위 메뉴, 선택 상태를 함께 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <NavigationDrawer aria-label="주 메뉴 선택 예시" defaultValue="learning">
        <NavigationDrawerMenu
          defaultExpanded
          filledIcon={<HomeFilledIcon />}
          label="학습"
          outlinedIcon={<HomeOutlinedIcon />}
          subItems={defaultSubItems}
          value="learning"
        />
      </NavigationDrawer>
      <NavigationDrawer aria-label="하위 메뉴 선택 예시" defaultValue="my-course">
        <NavigationDrawerMenu
          defaultExpanded
          filledIcon={<HomeFilledIcon />}
          label="학습"
          outlinedIcon={<HomeOutlinedIcon />}
          subItems={defaultSubItems}
          value="learning"
        />
      </NavigationDrawer>
    </div>
  ),
};

/* 주 메뉴와 하위 메뉴의 라벨·값·목록·처음 펼침 상태를 직접 바꿔요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
