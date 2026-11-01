import type { Meta, StoryObj } from '@storybook/react-vite';
import { SnackBar } from '@/packages/ui/src/snackbar/SnackBar/SnackBar.js';

const meta = {
  title: '컴포넌트/SnackBar',
  component: SnackBar,
  parameters: { layout: 'centered' },
  args: {
    children: '메시지를 작성합니다.',
    action: '액션',
    actionColor: '#3584fb',
  },
  argTypes: {
    children: {
      name: '텍스트',
      control: 'text',
      description: '스낵바 왼쪽에 표시할 메시지예요. 화면에는 최대 두 줄까지 표시돼요.',
    },
    action: {
      name: '버튼명',
      control: 'text',
      description: '스낵바 오른쪽 버튼에 표시할 내용이에요.',
    },
    actionColor: {
      name: '버튼 색상',
      control: 'color',
      description: '스낵바 오른쪽 버튼의 글자 색상이에요.',
    },
    onAction: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof SnackBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 한 줄과 두 줄 메시지의 전체 UI를 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: args => (
    <div style={{ display: 'grid', gap: 24 }}>
      <SnackBar {...args}>메시지를 작성합니다.</SnackBar>
      <SnackBar {...args}>
        스낵바 메시지가 길어지면 최대 두 줄까지 표시되는 모습을 확인할 수 있어요.
      </SnackBar>
    </div>
  ),
};

/* 텍스트, 버튼명과 버튼 색상을 바꿔 스낵바 하나를 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
