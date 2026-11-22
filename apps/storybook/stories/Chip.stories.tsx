import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryCase, StoryOverview } from '../components/StoryDeviceFrame.js';
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
  args: {
    children: 'ELI 라이브러리',
    disabled: false,
    selected: false,
    onSelectedChange: fn(),
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

/* 초기 선택 상태를 비교하고 각 칩은 독립적으로 선택·해제해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryOverview>
      <StoryCase title="선택 전"><ChipPreview selected={false}>ELI 라이브러리</ChipPreview></StoryCase>
      <StoryCase title="선택 후"><ChipPreview selected>ELI 라이브러리</ChipPreview></StoryCase>
    </StoryOverview>
  ),
};

/* 클릭과 Controls가 같은 선택 상태를 사용해 서로 갱신하도록 연결해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <Chip
        {...args}
        onSelectedChange={selected => {
          args.onSelectedChange?.(selected);
          updateArgs({ selected });
        }}
      />
    );
  },
};
