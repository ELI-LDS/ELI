import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryCase, StoryOverview } from '../components/StoryDeviceFrame.js';
import { Chip } from '@/packages/ui/src/chip/Chip/Chip.js';

const options = [
  { label: '블랙', value: 'black' },
  { label: '화이트', value: 'white' },
  { label: '네이비', value: 'navy' },
];

// Controls는 모든 역할의 값을 보관하고, 실제 렌더링에는 선택한 variant의 속성만 전달해요.
interface PreviewArgs {
  variant: 'selectable' | 'filter' | 'removable';
  children: string;
  disabled: boolean;
  selected: boolean;
  label: string;
  options: typeof options;
  selectedValues: string[];
  removeLabel: string;
  onSelectedChange: (selected: boolean) => void;
  onRemove: () => void;
  onClick: () => void;
}

function SelectablePreview() {
  const [selected, setSelected] = useState(false);
  return <Chip selected={selected} onSelectedChange={setSelected}>디자인</Chip>;
}

const meta = {
  title: '컴포넌트/Chip',
  component: Chip,
  args: {
    variant: 'selectable', children: '디자인', disabled: false, selected: false,
    label: '컬러', options, selectedValues: [], removeLabel: '디자인 태그 삭제',
    onSelectedChange: fn(), onRemove: fn(), onClick: fn(),
  },
  argTypes: {
    variant: { name: '유형', control: 'select', options: ['selectable', 'filter', 'removable'] },
    children: { name: '라벨', control: 'text', if: { arg: 'variant', neq: 'filter' } },
    selected: { name: '선택', control: 'boolean', if: { arg: 'variant', eq: 'selectable' } },
    disabled: { name: '비활성화', control: 'boolean' },
    label: { name: '기본 필터명', control: 'text', if: { arg: 'variant', eq: 'filter' } },
    options: { name: '옵션', control: 'object', if: { arg: 'variant', eq: 'filter' } },
    selectedValues: { name: '선택값', control: 'object', if: { arg: 'variant', eq: 'filter' } },
    removeLabel: { name: '삭제 버튼 설명', control: 'text', if: { arg: 'variant', eq: 'removable' } },
    onSelectedChange: { name: '선택 변경 동작', control: false },
    onRemove: { name: '삭제 동작', control: false },
    onClick: { name: '클릭 동작', control: false },
  },
} satisfies Meta<PreviewArgs>;

export default meta;
type Story = StoryObj<PreviewArgs>;

export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryOverview>
      <StoryCase title="selectable · 선택 전환"><SelectablePreview /></StoryCase>
      <StoryCase title="selectable · 선택 후"><Chip selected>디자인</Chip></StoryCase>
      <StoryCase title="filter · 필터 설정"><Chip variant="filter" label="컬러" options={options} /></StoryCase>
      <StoryCase title="filter · 여러 개 선택"><Chip variant="filter" label="컬러" options={options} selectedValues={['navy', 'black', 'white']} /></StoryCase>
      <StoryCase title="removable · 태그 삭제"><Chip variant="removable" onRemove={fn()}>디자인</Chip></StoryCase>
      <StoryCase title="selectable · 비활성"><Chip disabled>디자인</Chip></StoryCase>
      <StoryCase title="filter · 비활성"><Chip variant="filter" label="컬러" options={options} disabled /></StoryCase>
      <StoryCase title="removable · 비활성"><Chip variant="removable" onRemove={fn()} disabled>디자인</Chip></StoryCase>
    </StoryOverview>
  ),
};

export const Playground: Story = {
  name: '직접 바꿔보기',
  render: function Render(args) {
    const [, updateArgs] = useArgs<PreviewArgs>();
    const common = { disabled: args.disabled, onClick: args.onClick };
    if (args.variant === 'filter') return <Chip {...common} variant="filter" label={args.label} options={args.options} selectedValues={args.selectedValues} />;
    if (args.variant === 'removable') return <Chip {...common} variant="removable" onRemove={args.onRemove} removeLabel={args.removeLabel}>{args.children}</Chip>;
    return <Chip {...common} selected={args.selected} onSelectedChange={selected => { args.onSelectedChange(selected); updateArgs({ selected }); }}>{args.children}</Chip>;
  },
};
