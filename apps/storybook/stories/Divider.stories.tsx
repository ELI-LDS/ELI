import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryCase, StoryOverview } from '../components/StoryDeviceFrame.js';
import { Divider } from '@/packages/ui/src/divider/Divider/Divider.js';

const meta = {
  title: '컴포넌트/Divider',
  component: Divider,
  argTypes: {
    className: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 부모 영역에 맞춰 반응형으로 늘어나는 기본 구분선을 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: args => (
    <StoryOverview>
      <StoryCase title="기본 구분선">
        <div style={{ width: 'min(362px, calc(100vw - 32px))' }}>
          <Divider {...args} />
        </div>
      </StoryCase>
    </StoryOverview>
  ),
};
