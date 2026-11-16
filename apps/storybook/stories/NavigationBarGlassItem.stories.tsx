import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  StoryCase,
  StoryDeviceFrame,
  StoryOverview,
} from '../components/StoryDeviceFrame.js';
import { HomeFilledIcon } from '@/packages/ui/src/icon/HomeFilledIcon.js';
import { HomeOutlinedIcon } from '@/packages/ui/src/icon/HomeOutlinedIcon.js';
import { NavigationBarGlassItem } from '@/packages/ui/src/navigation/NavigationBarGlassItem/NavigationBarGlassItem.js';

const meta = {
  title: '컴포넌트/NavigationBarGlassItem',
  component: NavigationBarGlassItem,
  args: {
    active: false,
    filledIcon: <HomeFilledIcon />,
    label: '홈',
    outlinedIcon: <HomeOutlinedIcon />,
  },
  argTypes: {
    label: {
      name: '항목 설명',
      control: 'text',
      description: '화면에는 보이지 않고 화면 낭독기가 읽는 항목 설명이에요.',
    },
    active: {
      name: '활성 항목',
      control: 'boolean',
      description: '`true`이면 현재 항목으로 표시하고 filled 아이콘을 사용해요.',
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
    <StoryDeviceFrame label="Glass Navigation Bar Item 직접 바꿔보기">
      <NavigationBarGlassItem {...args} />
    </StoryDeviceFrame>
  ),
} satisfies Meta<typeof NavigationBarGlassItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 기본 아이콘과 활성 아이콘의 전환을 한눈에 비교해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryOverview>
      <StoryCase title="Default">
        <StoryDeviceFrame label="기본 Glass Navigation Bar Item 미리보기">
        <NavigationBarGlassItem
          filledIcon={<HomeFilledIcon />}
          label="기본 홈"
          outlinedIcon={<HomeOutlinedIcon />}
        />
        </StoryDeviceFrame>
      </StoryCase>
      <StoryCase title="Active">
        <StoryDeviceFrame label="활성 Glass Navigation Bar Item 미리보기">
        <NavigationBarGlassItem
          active
          filledIcon={<HomeFilledIcon />}
          label="활성 홈"
          outlinedIcon={<HomeOutlinedIcon />}
        />
        </StoryDeviceFrame>
      </StoryCase>
    </StoryOverview>
  ),
};

/* 화면 낭독기 설명과 활성 여부를 직접 바꿔봐요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
