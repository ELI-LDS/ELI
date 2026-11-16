import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryCase, StoryOverview } from '../components/StoryDeviceFrame.js';
import { fn } from 'storybook/test';
import { RemovableChip } from '@/packages/ui/src/chip/RemovableChip/RemovableChip.js';

const meta = {
  title: '컴포넌트/Chip/RemovableChip',
  component: RemovableChip,
  args: {
    children: 'ELI 라이브러리',
    disabled: false,
    onClick: fn(),
    onRemove: fn(),
    removeLabel: '삭제',
  },
  argTypes: {
    children: {
      name: '라벨',
      control: 'text',
      description: '칩에 표시할 라벨이에요.',
    },
    disabled: {
      name: '비활성화',
      control: 'boolean',
      description: '라벨과 삭제 버튼을 모두 누를 수 없게 해요.',
    },
    removeLabel: {
      name: '삭제 버튼 설명',
      control: 'text',
      description: 'X 아이콘이 무엇을 삭제하는 버튼인지 화면 낭독기가 읽을 수 있게 설명해요.',
    },
    onClick: {
      name: '라벨 동작',
      action: 'label-click',
      description: '라벨 영역을 누르면 호출돼요.',
    },
    onRemove: {
      name: '삭제 동작',
      action: 'remove',
      description: 'X 아이콘을 누르면 별도로 호출돼요.',
    },
  },
} satisfies Meta<typeof RemovableChip>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 기본 라벨과 최대 너비의 말줄임표를 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: args => (
    <StoryOverview>
      <StoryCase title="기본 문구">
        <RemovableChip {...args}>ELI 라이브러리</RemovableChip>
      </StoryCase>
      <StoryCase title="긴 문구">
        <RemovableChip {...args}>아주 긴 최근 검색어를 표시합니다</RemovableChip>
      </StoryCase>
    </StoryOverview>
  ),
};

/* 라벨과 X 버튼이 서로 다른 동작을 실행하는지 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
