import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from '@/packages/ui/src/chip/Chip/Chip.js';
import type { ChipProps } from '@/packages/ui/src/chip/Chip/Chip.types.js';

function ChipPreview(props: ChipProps) {
  const { onSelectedChange, selected: initialSelected = false, ...chipProps } = props;
  const [selected, setSelected] = useState(initialSelected);

  return (
    <Chip
      {...chipProps}
      selected={selected}
      onSelectedChange={nextSelected => {
        setSelected(nextSelected);
        onSelectedChange?.(nextSelected);
      }}
    />
  );
}

const meta = {
  title: '컴포넌트/Chip/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  args: {
    children: 'ELI 라이브러리',
    disabled: false,
    selected: false,
  },
  argTypes: {
    children: {
      name: '라벨',
      control: 'text',
      description: '칩에 표시할 라벨이에요.',
    },
    selected: {
      name: '선택',
      control: 'boolean',
      description: '선택된 상태로 표시해요.',
    },
    disabled: {
      name: '비활성화',
      control: 'boolean',
      description: '칩을 선택할 수 없게 해요.',
    },
    onSelectedChange: {
      name: '선택 변경 동작',
      action: 'selected-change',
      description: '칩을 누르면 다음 선택 상태를 전달해요.',
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Default와 Selected 디자인을 나란히 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <Chip selected={false}>ELI 라이브러리</Chip>
      <Chip selected>ELI 라이브러리</Chip>
    </div>
  ),
};

/* 직접 눌러 부모가 선택 상태를 갱신하는 흐름을 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  render: args => <ChipPreview key={String(args.selected)} {...args} />,
};
