import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from '@/packages/ui/src/chip/Chip/Chip.js';

const states = [
  { name: 'Off', selected: false },
  { name: 'On', selected: true },
] as const;

const meta = {
  title: '컴포넌트/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  args: {
    children: 'ELI 라이브러리',
    removeLabel: '삭제',
    selected: false,
  },
  argTypes: {
    children: {
      name: '텍스트',
      control: 'text',
      description: '칩에 표시할 내용이에요.',
    },
    selected: {
      name: '선택',
      control: 'boolean',
      description: '선택된 칩으로 표시해요.',
    },
    removeLabel: {
      name: '닫기 버튼 이름',
      control: 'text',
      description: '화면 낭독기에 전달할 닫기 버튼 이름이에요.',
    },
    onRemove: {
      name: '닫기 동작',
      action: 'remove',
      description: '닫기 버튼을 누르면 호출돼요.',
    },
  },
} satisfies Meta<typeof Chip>;

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
        <div key={state.name} style={{ display: 'grid', gap: 8 }}>
          <span style={{ color: '#6c788a', fontSize: 12 }}>{state.name}</span>
          <Chip selected={state.selected}>ELI 라이브러리</Chip>
        </div>
      ))}
    </div>
  ),
};

/* 공개 props를 바꿔 칩 하나를 직접 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
