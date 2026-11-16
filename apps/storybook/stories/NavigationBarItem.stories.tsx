import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  StoryCase,
  StoryDeviceFrame,
  StoryOverview,
} from '../components/StoryDeviceFrame.js';
import { HomeFilledIcon } from '@/packages/ui/src/icon/HomeFilledIcon.js';
import { HomeOutlinedIcon } from '@/packages/ui/src/icon/HomeOutlinedIcon.js';
import { NavigationBarItem } from '@/packages/ui/src/navigation/NavigationBarItem/NavigationBarItem.js';

const meta = {
  title: '컴포넌트/NavigationBarItem',
  component: NavigationBarItem,
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
  render: args => (
    <StoryDeviceFrame label="Navigation Bar Item 직접 바꿔보기">
      <NavigationBarItem {...args} />
    </StoryDeviceFrame>
  ),
} satisfies Meta<typeof NavigationBarItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 기본·활성 상태와 실제 Hover·Pressed 상호작용을 함께 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryOverview description="비활성 항목에 마우스를 올리거나 누른 채로 Hover와 Pressed를 확인해요.">
      <StoryCase title="Default">
        <StoryDeviceFrame label="기본 Navigation Bar Item 미리보기">
          <NavigationBarItem
            filledIcon={<HomeFilledIcon />}
            label="라벨"
            outlinedIcon={<HomeOutlinedIcon />}
          />
        </StoryDeviceFrame>
      </StoryCase>
      <StoryCase title="Active">
        <StoryDeviceFrame label="활성 Navigation Bar Item 미리보기">
          <NavigationBarItem
            active
            filledIcon={<HomeFilledIcon />}
            label="라벨"
            outlinedIcon={<HomeOutlinedIcon />}
          />
        </StoryDeviceFrame>
      </StoryCase>
    </StoryOverview>
  ),
};

/* 라벨과 활성 여부를 바꾸며 아이콘 형태 전환을 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
