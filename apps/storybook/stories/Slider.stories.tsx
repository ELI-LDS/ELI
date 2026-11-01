import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Slider } from '@/packages/ui/src/slider/Slider/Slider.js';
import type {
  SliderProps,
  SliderRangeProps,
  SliderRangeValue,
  SliderStandardProps,
} from '@/packages/ui/src/slider/Slider/Slider.types.js';

const meta = {
  title: '컴포넌트/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': '값 선택',
    defaultValue: 60,
    disabled: false,
    max: 100,
    min: 0,
    showMarker: true,
    showValueIndicator: true,
    step: 1,
    variant: 'standard',
  },
  argTypes: {
    variant: {
      name: '선택 방식',
      control: 'radio',
      options: ['standard', 'range'],
      description: '하나의 값은 `standard`, 시작·끝 범위는 `range`를 선택해요.',
    },
    defaultValue: {
      name: '처음 값',
      control: 'object',
      description: 'Standard는 숫자, Range는 `[시작 값, 끝 값]`을 입력해요.',
    },
    min: { name: '최솟값', control: 'number' },
    max: { name: '최댓값', control: 'number' },
    step: { name: '이동 간격', control: 'number' },
    showMarker: { name: '양 끝 값 표시', control: 'boolean' },
    showValueIndicator: {
      name: '현재 값 표시',
      control: 'boolean',
      description: 'Standard Handle 위의 현재 값을 표시해요.',
    },
    showLeftValueIndicator: {
      name: '시작 값 표시',
      control: 'boolean',
      description: 'Range의 왼쪽 Handle 위에 시작 값을 표시해요.',
    },
    showRightValueIndicator: {
      name: '끝 값 표시',
      control: 'boolean',
      description: 'Range의 오른쪽 Handle 위에 끝 값을 표시해요.',
    },
    disabled: { name: '비활성화', control: 'boolean' },
    'aria-label': {
      name: '기능 설명',
      control: 'text',
      description: 'Slider가 조절하는 값을 화면 낭독기에 설명해요.',
    },
    onValueChange: { action: 'valueChange', table: { disable: true } },
    value: { table: { disable: true } },
    className: { table: { disable: true } },
  },
} satisfies Meta<SliderProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const previewStyle = {
  boxSizing: 'border-box',
  padding: '64px 16px 16px',
  width: 'min(375px, 100vw)',
} as const;

/* 두 형태와 값 표시 위치를 Figma 기준으로 함께 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 80, ...previewStyle }}>
      <section style={{ display: 'grid', gap: 12 }}>
        <h3 style={{ margin: 0 }}>Standard</h3>
        <Slider aria-label="기본 값" defaultValue={60} />
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <h3 style={{ margin: 0 }}>Range</h3>
        <Slider aria-label="범위 값" defaultValue={[27, 60]} variant="range" />
      </section>
    </div>
  ),
};

function SliderPreview(props: SliderProps) {
  const [standardValue, setStandardValue] = useState(
    props.variant !== 'range' && typeof props.defaultValue === 'number'
      ? props.defaultValue
      : 60,
  );
  const [rangeValue, setRangeValue] = useState<SliderRangeValue>(
    props.variant === 'range' && Array.isArray(props.defaultValue)
      ? props.defaultValue
      : [27, 60],
  );

  if (props.variant === 'range') {
    const rangeProps = { ...props } as SliderRangeProps & { showValueIndicator?: boolean };
    delete rangeProps.showValueIndicator;
    return (
      <Slider
        {...rangeProps}
        defaultValue={Array.isArray(props.defaultValue) ? props.defaultValue : [27, 60] as const}
        onValueChange={setRangeValue}
        value={rangeValue}
      />
    );
  }

  const standardProps = { ...props } as SliderStandardProps & {
    showLeftValueIndicator?: boolean;
    showRightValueIndicator?: boolean;
  };
  delete standardProps.showLeftValueIndicator;
  delete standardProps.showRightValueIndicator;
  return (
    <Slider
      {...standardProps}
      defaultValue={typeof props.defaultValue === 'number' ? props.defaultValue : 60}
      onValueChange={setStandardValue}
      value={standardValue}
    />
  );
}

/* Controls와 실제 드래그·키보드 조작을 함께 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  render: args => (
    <div style={previewStyle}>
      <SliderPreview {...args} />
    </div>
  ),
};
