import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { StoryCase, StoryOverview } from '../components/StoryDeviceFrame.js';
import { SnackBar } from '@/packages/ui/src/snackbar/SnackBar/SnackBar.js';

const meta = {
  title: '컴포넌트/SnackBar',
  component: SnackBar,
  args: {
    children: '메시지를 작성합니다.',
    action: '액션',
    actionColor: '#3584fb',
    open: false,
    duration: 5000,
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <button type="button" onClick={() => updateArgs({ open: true })}>스낵바 표시</button>
        <SnackBar {...args} onOpenChange={open => {
          args.onOpenChange?.(open);
          updateArgs({ open });
        }} />
      </div>
    );
  },
  argTypes: {
    open: { name: '표시하기', control: 'boolean', description: '표시 버튼으로 다시 열고, 자동 닫힘 결과를 Controls에서도 확인해요.' },
    duration: { name: '표시 시간(ms)', control: { type: 'number', min: 0 }, description: '기본 5000ms 후 닫혀요. 0이면 자동으로 닫히지 않아요. 마우스·포커스·창 비활성 중에는 남은 시간이 멈춰요.' },
    defaultOpen: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
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
    <StoryOverview>
      <StoryCase title="한 줄 메시지">
        <SnackBar {...args} open duration={0}>메시지를 작성합니다.</SnackBar>
      </StoryCase>
      <StoryCase title="두 줄 메시지">
        <SnackBar {...args} open duration={0}>
          스낵바 메시지가 길어지면 최대 두 줄까지 표시되는 모습을 확인할 수 있어요.
        </SnackBar>
      </StoryCase>
    </StoryOverview>
  ),
};

/* 텍스트, 버튼명과 버튼 색상을 바꿔 스낵바 하나를 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
