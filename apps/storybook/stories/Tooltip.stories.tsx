import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from '@/packages/ui/src/tooltip/Tooltip/Tooltip.js';

const meta = {
  title: '컴포넌트/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  args: {
    children: '버튼을 누르면 파일을 저장해요.',
  },
  argTypes: {
    children: {
      name: '설명',
      control: 'text',
      description: '툴팁에 표시할 내용이에요. 내용이 길면 최대 200px 안에서 여러 줄로 표시해요.',
    },
    className: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 한 줄과 여러 줄 설명을 함께 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      <Tooltip>버튼을 누르면 파일을 저장해요.</Tooltip>
      <Tooltip>{'툴팁 컴포넌트예요.\n여러 줄로 작성할 수 있고 최대 너비는 200px이에요.'}</Tooltip>
    </div>
  ),
};

/* 설명을 바꿔 툴팁 하나를 직접 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  parameters: { layout: 'padded' },
  decorators: [Story => (
    <div style={{ display: 'flex', minHeight: 200, alignItems: 'flex-start' }}>
      <Story />
    </div>
  )],
};
