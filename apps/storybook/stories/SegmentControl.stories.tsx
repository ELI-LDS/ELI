import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryCase, StoryOverview } from '../components/StoryDeviceFrame.js';
import { SegmentControl } from '@/packages/ui/src/segment-control/SegmentControl/SegmentControl.js';
import type {
  SegmentControlOptions,
  SegmentControlProps,
} from '@/packages/ui/src/segment-control/SegmentControl/SegmentControl.types.js';

const twoOptions: SegmentControlOptions = [
  { label: '라벨', value: '1' },
  { label: '라벨', value: '2' },
];
const threeOptions: SegmentControlOptions = [
  { label: '라벨', value: '1' },
  { label: '라벨', value: '2' },
  { label: '라벨', value: '3' },
];
const fourOptions: SegmentControlOptions = [
  { label: '라벨', value: '1' },
  { label: '라벨', value: '2' },
  { label: '라벨', value: '3' },
  { label: '라벨', value: '4' },
];

function SegmentControlPreview(props: SegmentControlProps) {
  const { defaultValue, onValueChange, value: initialValue, ...segmentControlProps } = props;
  const [value, setValue] = useState(
    initialValue ?? defaultValue ?? props.options[0]?.value ?? '',
  );

  return (
    <SegmentControl
      {...segmentControlProps}
      value={value}
      onValueChange={nextValue => {
        setValue(nextValue);
        onValueChange?.(nextValue);
      }}
    />
  );
}

const meta = {
  title: '컴포넌트/SegmentControl',
  component: SegmentControl,
  args: {
    'aria-label': '보기 방식',
    options: twoOptions,
    value: '1',
  },
  argTypes: {
    'aria-label': {
      name: '선택 영역 설명',
      control: 'text',
      description: 'Segment Control이 무엇을 선택하는 영역인지 화면 낭독기가 읽을 수 있게 설명해요.',
    },
    options: {
      name: '옵션',
      control: 'object',
      description: '라벨과 값으로 구성된 옵션을 2개부터 4개까지 전달해요.',
    },
    value: {
      name: '선택 값',
      control: 'text',
      description: '현재 선택된 옵션의 값이에요.',
    },
    defaultValue: {
      name: '초기 선택 값',
      control: 'text',
      description: '비제어 방식에서 처음 선택할 값이에요.',
    },
    onValueChange: {
      name: '선택 변경 동작',
      action: 'value-change',
      description: '옵션을 선택하면 해당 값을 전달해요.',
    },
  },
} satisfies Meta<typeof SegmentControl>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 2개부터 4개까지 모든 선택 위치를 Figma와 같은 순서로 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryOverview>
      {[twoOptions, threeOptions, fourOptions].map(options => (
        <StoryCase key={options.length} title={`${options.length}개 항목`}>
          <div style={{ display: 'grid', gap: 16 }}>
          {options.map(option => (
            <SegmentControl
              aria-label={`${options.length}개 Segment`}
              defaultValue={option.value}
              key={option.value}
              options={options}
            />
          ))}
          </div>
        </StoryCase>
      ))}
    </StoryOverview>
  ),
};

/* 옵션과 선택 값을 바꾸고 직접 눌러 동작을 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  render: args => (
    <SegmentControlPreview
      key={`${args.value}-${args.options.map(option => option.value).join('-')}`}
      {...args}
    />
  ),
};
