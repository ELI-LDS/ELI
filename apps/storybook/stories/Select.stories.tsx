import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from '@/packages/ui/src/select/Select/Select.js';

const options = [
  { label: '옵션 1', value: 'option-1' },
  { label: '옵션 2', value: 'option-2' },
];

const meta = {
  title: '컴포넌트/Select',
  component: Select,
  parameters: { layout: 'centered' },
  args: {
    label: '라벨',
    options,
    placeholder: '선택해주세요.',
  },
  argTypes: {
    label: {
      name: '라벨',
      control: 'text',
      description: '선택 영역 위에 표시할 라벨이에요.',
    },
    placeholder: {
      name: 'Placeholder 문구',
      control: 'text',
      description: '값을 선택하기 전에 표시할 안내 문구예요.',
    },
    options: {
      name: '옵션 목록',
      control: 'object',
      description: '목록에 표시할 label과 선택에 사용할 value를 입력해요.',
    },
    defaultValue: {
      table: { disable: true },
    },
    onValueChange: {
      table: { disable: true },
    },
    value: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 선택 전과 선택 완료 상태에서 실제 Hover와 펼침 동작을 확인해요. */
export const States: Story = {
  name: '상태별 보기',
  parameters: { controls: { disable: true } },
  render: args => (
    <div
      style={{
        display: 'grid',
        fontFamily: 'var(--eli-font-family-family, "Pretendard Variable")',
        gap: 40,
      }}
    >
      <p style={{ color: '#4b5668', margin: 0 }}>
        선택 영역에 마우스를 올리거나 눌러 Hover와 펼침 상태를 확인해요.
      </p>

      <div style={{ display: 'grid', gap: 8 }}>
        <strong>선택 전</strong>
        <Select {...args} />
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <strong>선택 완료</strong>
        <Select {...args} defaultValue="option-1" />
      </div>
    </div>
  ),
};

/* 라벨, Placeholder 문구와 옵션 목록을 바꿔 Select 하나를 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  parameters: { controls: { include: ['label', 'placeholder', 'options'] } },
};
