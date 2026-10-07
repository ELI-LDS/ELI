import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from '@/packages/ui/src/toggle/Toggle/Toggle.js';

const meta = {
  title: '컴포넌트/토글',
  component: Toggle,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': '토글',
    defaultChecked: false,
  },
  argTypes: {
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
export const States: Story = {
  name: '상태별 보기',
  render: () => (
    <div style={{ alignItems: 'center', display: 'flex', gap: 24 }}>
      <Toggle aria-label="Off 토글" />
      <Toggle aria-label="On 토글" defaultChecked />
    </div>
  ),
};

/* 초기 상태를 바꾸고 클릭해 Toggle 하나를 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  render: args => <Toggle {...args} key={String(args.defaultChecked)} />,
};
