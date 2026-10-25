import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterChip } from '@/packages/ui/src/chip/FilterChip/FilterChip.js';

const options = [
  { label: '블랙', value: 'black' },
  { label: '화이트', value: 'white' },
  { label: '네이비', value: 'navy' },
] as const;

const meta = {
  title: '컴포넌트/Chip/FilterChip',
  component: FilterChip,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: '컬러',
    options,
    selectedValues: [],
  },
  argTypes: {
    label: {
      name: '기본 라벨',
      control: 'text',
      description: '선택한 값이 없을 때 표시할 필터 항목명이에요.',
    },
    selectedValues: {
      name: '선택값',
      control: { type: 'check' },
      options: options.map(option => option.value),
      description: '현재 적용한 옵션의 value 목록이에요.',
    },
    options: {
      name: '옵션',
      control: 'object',
      description: '화면에 정의된 순서대로 전달하는 전체 옵션이에요.',
    },
    disabled: {
      name: '비활성화',
      control: 'boolean',
      description: '필터 화면을 열 수 없게 해요.',
    },
    onClick: {
      name: '필터 열기 동작',
      action: 'open-filter',
      description: '바텀시트나 모달을 열 때 사용해요.',
    },
  },
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 선택하지 않은 상태와 한 개·여러 개를 선택한 상태를 확인해요. */
export const States: Story = {
  name: '상태별 보기',
  parameters: { controls: { disable: true } },
  render: args => (
    <div style={{ display: 'flex', gap: 24 }}>
      <FilterChip {...args} selectedValues={[]} />
      <FilterChip {...args} selectedValues={['white']} />
      <FilterChip {...args} selectedValues={['navy', 'black', 'white']} />
    </div>
  ),
};

/* 선택값을 바꿔 라벨 계산과 최대 너비를 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
