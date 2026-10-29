import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeFilledIcon } from '@/packages/ui/src/icon/HomeFilledIcon.js';
import { HomeOutlinedIcon } from '@/packages/ui/src/icon/HomeOutlinedIcon.js';
import { NavigationBarItem } from '@/packages/ui/src/navigation/NavigationBarItem/NavigationBarItem.js';

const meta = {
  title: '컴포넌트/NavigationBarItem',
  component: NavigationBarItem,
  parameters: { layout: 'centered' },
  args: {
    active: false,
    filledIcon: <HomeFilledIcon />,
    label: '라벨',
    outlinedIcon: <HomeOutlinedIcon />,
  },
  argTypes: {
    label: {
      name: '라벨',
      control: 'text',
      description: '아이콘 아래에 표시할 한 줄 라벨이에요.',
    },
    active: {
      name: '활성 탭',
      control: 'boolean',
      description: '`true`이면 현재 탭으로 표시하고 filled 아이콘을 사용해요.',
    },
    outlinedIcon: {
      table: { disable: true },
    },
    filledIcon: {
      table: { disable: true },
    },
    onClick: {
      name: '선택 동작',
      action: 'click',
      description: '항목을 선택했을 때 실행할 함수예요.',
    },
    className: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof NavigationBarItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 기본·활성 상태와 실제 Hover·Pressed 상호작용을 함께 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <p style={{ color: '#4b5668', margin: 0 }}>
        비활성 항목에 마우스를 올리거나 누른 채로 Hover와 Pressed를 확인해요.
      </p>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
          <span>Default</span>
          <NavigationBarItem
            filledIcon={<HomeFilledIcon />}
            label="라벨"
            outlinedIcon={<HomeOutlinedIcon />}
          />
        </div>
        <div style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
          <span>Active</span>
          <NavigationBarItem
            active
            filledIcon={<HomeFilledIcon />}
            label="라벨"
            outlinedIcon={<HomeOutlinedIcon />}
          />
        </div>
      </div>
    </div>
  ),
};

/* 라벨과 활성 여부를 바꾸며 아이콘 형태 전환을 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
