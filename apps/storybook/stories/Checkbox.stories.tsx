import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@/packages/ui/src/checkbox/Checkbox/Checkbox.js';

const states = [
  { name: 'Off', checked: false },
  { name: 'On', checked: true },
] as const;

const meta = {
  title: '컴포넌트/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': '동의',
    defaultChecked: false,
  },
  argTypes: {
    'aria-label': {
      name: '접근성 이름',
      control: 'text',
      description: '화면 낭독기에 전달할 체크박스 이름이에요.',
    },
    defaultChecked: {
      name: '처음 선택 상태',
      control: 'boolean',
      description: '제어하지 않을 때 처음 표시할 선택 상태예요.',
    },
    checked: {
      name: '선택 (제어)',
      control: false,
      description: '외부에서 제어하는 선택 상태예요. `onChange`와 함께 사용해요.',
    },
    onChange: {
      name: '변경 동작',
      action: 'change',
      description: '선택 상태가 바뀌면 호출돼요.',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Off와 On 상태를 한눈에 확인해요. */
export const States: Story = {
  name: '상태별 보기',
  render: () => (
    <div
      style={{
        display: 'flex',
        fontFamily: 'var(--eli-font-family-sans, "Pretendard Variable")',
        gap: 32,
      }}
    >
      {states.map(state => (
        <div key={state.name} style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
          <span style={{ color: '#6c788a', fontSize: 12 }}>{state.name}</span>
          <Checkbox aria-label={state.name} defaultChecked={state.checked} />
        </div>
      ))}
    </div>
  ),
};

/* 직접 눌러 선택 상태가 바뀌는지 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
