import { useArgs } from 'storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryCase, StoryOverview } from '../components/StoryDeviceFrame.js';
import { TextField } from '@/packages/ui/src/text/TextField/TextField.js';

const meta = {
  title: '컴포넌트/TextField',
  component: TextField,
  args: {
    label: '라벨',
    placeholder: '내용을 입력하세요',
    state: 'default',
  },
  argTypes: {
    value: { name: '입력값', control: 'text', description: '입력하거나 X로 지우면 Controls에도 바로 반영돼요.' },
    label: {
      name: '라벨',
      control: 'text',
      description: '입력창 위에 표시할 라벨이에요.',
    },
    placeholder: {
      name: 'Placeholder 문구',
      control: 'text',
      description: '값을 입력하기 전에 입력창에 표시할 안내 문구예요.',
    },
    state: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 회원가입 폼에서 서로 겹치지 않는 네 가지 상태를 한눈에 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: args => (
    <StoryOverview description="기본 입력창에 마우스를 올리거나 선택해 Hover와 Focus 상태를 확인해요.">
      {([
        ['기본', 'default'],
        ['오류', 'error'],
        ['성공', 'success'],
        ['비활성화', 'disabled'],
      ] as const).map(([name, state]) => (
        <StoryCase key={state} title={name}>
          <TextField {...args} state={state} />
        </StoryCase>
      ))}
    </StoryOverview>
  ),
};

/* 라벨과 Placeholder 문구를 바꿔 Text Field 하나를 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  args: { value: '' },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return <TextField {...args} onChange={event => { args.onChange?.(event); updateArgs({ value: event.currentTarget.value }); }} />;
  },
  parameters: { controls: { include: ['라벨', 'Placeholder 문구', '입력값'] } },
};
