import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeFilledIcon } from '@/packages/ui/src/icon/HomeFilledIcon.js';
import { HomeOutlinedIcon } from '@/packages/ui/src/icon/HomeOutlinedIcon.js';
import { NavigationDrawerItem } from '@/packages/ui/src/navigation/NavigationDrawerItem/NavigationDrawerItem.js';

const meta = {
  title: '컴포넌트/NavigationDrawerItem',
  component: NavigationDrawerItem,
  parameters: { layout: 'centered' },
  args: {
    active: false,
    defaultExpanded: true,
    expandable: true,
    filledIcon: <HomeFilledIcon />,
    label: '라벨',
    outlinedIcon: <HomeOutlinedIcon />,
    subItems: <NavigationDrawerItem label="하위 라벨" variant="sub-menu" />,
    variant: 'main-menu',
  },
  argTypes: {
    variant: {
      name: '항목 유형',
      control: 'select',
      options: ['main-menu', 'sub-menu'],
      description: '주 메뉴 또는 하위 메뉴 중 역할에 맞는 유형을 골라요.',
    },
    label: {
      name: '라벨',
      control: 'text',
      description: '항목에 표시할 한 줄 이름이에요.',
    },
    active: {
      name: '현재 메뉴',
      control: 'boolean',
      description: '`true`이면 현재 메뉴의 배경과 글자색을 사용하고 Main Menu에서는 filled 아이콘을 표시해요.',
    },
    expandable: {
      name: '하위 메뉴 있음',
      control: 'boolean',
      description: 'Main Menu 오른쪽에 펼침 상태 아이콘을 표시해요.',
    },
    defaultExpanded: {
      name: '처음 펼침',
      control: 'boolean',
      description: '제어하지 않는 Main Menu가 처음 열려 있을지 정해요.',
    },
    expanded: { table: { disable: true } },
    subItems: { table: { disable: true } },
    outlinedIcon: { table: { disable: true } },
    filledIcon: { table: { disable: true } },
    onClick: {
      name: '선택 동작',
      action: 'click',
      description: 'Main Menu 또는 Sub Menu를 선택했을 때 실행할 함수예요.',
    },
    onExpandedChange: {
      name: '펼침 변경 동작',
      action: 'expanded-change',
      description: 'Main Menu가 열리거나 닫힐 때 다음 상태를 전달해요.',
    },
    className: { table: { disable: true } },
  },
  render: args => (
    <NavigationDrawerItem
      key={`${args.variant}-${'defaultExpanded' in args ? args.defaultExpanded : false}`}
      {...args}
    />
  ),
} satisfies Meta<typeof NavigationDrawerItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 항목 유형과 활성 상태를 한눈에 비교해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 24, width: 230 }}>
      <p style={{ color: '#4b5668', margin: 0 }}>
        비활성 메뉴에 마우스를 올리거나 누른 채로 Hover와 Pressed를 확인해요.
      </p>
      <div style={{ display: 'grid', gap: 8 }}>
        <strong>Main Menu</strong>
        <NavigationDrawerItem
          expandable
          filledIcon={<HomeFilledIcon />}
          label="라벨"
          outlinedIcon={<HomeOutlinedIcon />}
        />
        <NavigationDrawerItem
          active
          expandable
          filledIcon={<HomeFilledIcon />}
          label="라벨"
          outlinedIcon={<HomeOutlinedIcon />}
        />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <strong>Sub Menu</strong>
        <NavigationDrawerItem label="라벨" variant="sub-menu" />
        <NavigationDrawerItem active label="라벨" variant="sub-menu" />
      </div>
    </div>
  ),
};

/* 항목 유형·라벨·활성·펼침 상태를 직접 바꿔요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  decorators: [Story => <div style={{ width: 230 }}><Story /></div>],
};
