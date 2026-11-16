import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryCase, StoryOverview } from '../components/StoryDeviceFrame.js';
import { Toggle } from '@/packages/ui/src/toggle/Toggle/Toggle.js';

const meta = {
  title: '컴포넌트/Toggle',
  component: Toggle,
  args: {
    'aria-label': '토글',
    defaultChecked: false,
  },
  argTypes: {
    'aria-label': {
      name: '토글 설명',
      control: 'text',
      description: '토글로 무엇을 켜고 끄는지 화면 낭독기가 읽을 수 있게 설명해요.',
    },
    defaultChecked: {
      name: '초기 상태',
      control: 'boolean',
      description: '처음 표시할 On/Off 상태예요.',
    },
    checked: {
      table: { disable: true },
    },
    onCheckedChange: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Off와 On 디자인을 함께 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryOverview>
      <StoryCase title="Off"><Toggle aria-label="Off 토글" /></StoryCase>
      <StoryCase title="On"><Toggle aria-label="On 토글" defaultChecked /></StoryCase>
    </StoryOverview>
  ),
};

/* 초기 상태를 바꾸고 클릭해 Toggle 하나를 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  render: args => <Toggle {...args} key={String(args.defaultChecked)} />,
};
