import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeFilledIcon } from '@/packages/ui/src/icon/HomeFilledIcon.js';
import { HomeOutlinedIcon } from '@/packages/ui/src/icon/HomeOutlinedIcon.js';
import { NavigationBar } from '@/packages/ui/src/navigation/NavigationBar/NavigationBar.js';
import type {
  NavigationBarOption,
  NavigationBarOptions,
  NavigationBarProps,
} from '@/packages/ui/src/navigation/NavigationBar/NavigationBar.types.js';

type NavigationBarStoryArgs = NavigationBarProps & {
  activeIndex: number;
  itemCount: 3 | 4 | 5;
  labels: string[];
};

const defaultLabels = ['홈', '검색', '알림', '저장', '내 정보'];

function createOption(label: string, index: number): NavigationBarOption {
  return {
    value: `item-${index + 1}`,
    label,
    outlinedIcon: <HomeOutlinedIcon />,
    filledIcon: <HomeFilledIcon />,
  };
}

function createItems(count: 3 | 4 | 5, labels: string[]): NavigationBarOptions {
  const item = (index: number) => createOption(labels[index] ?? `항목 ${index + 1}`, index);

  if (count === 3) return [item(0), item(1), item(2)];
  if (count === 4) return [item(0), item(1), item(2), item(3)];
  return [item(0), item(1), item(2), item(3), item(4)];
}

function NavigationBarPreview({
  activeIndex,
  itemCount,
  labels,
  onValueChange,
  ...navigationBarProps
}: NavigationBarStoryArgs) {
  const items = createItems(itemCount, labels);
  const initialIndex = Math.min(Math.max(activeIndex, 0), items.length - 1);
  const initialItem = items[initialIndex] ?? items[0];
  const [value, setValue] = useState(initialItem.value);

  return (
    <NavigationBar
      {...navigationBarProps}
      items={items}
      onValueChange={nextValue => {
        setValue(nextValue);
        onValueChange?.(nextValue);
      }}
      value={value}
    />
  );
}

const meta = {
  title: '컴포넌트/NavigationBar',
  component: NavigationBar,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': '주요 메뉴',
    activeIndex: 0,
    itemCount: 3,
    items: createItems(3, defaultLabels),
    labels: defaultLabels,
  },
  argTypes: {
    'aria-label': {
      name: '탐색 영역 설명',
      control: 'text',
      description: 'Navigation Bar가 어떤 탐색 영역인지 화면 낭독기가 읽을 수 있게 설명해요.',
    },
    itemCount: {
      name: '항목 수',
      control: 'select',
      options: [3, 4, 5],
      description: '디자인 명세에 맞게 3개부터 5개까지 선택해요.',
    },
    activeIndex: {
      name: '처음 활성화할 순서',
      control: { type: 'number', min: 0, max: 4, step: 1 },
      description: '0부터 시작하는 활성 항목의 순서예요. 항목 수보다 크면 마지막 항목을 사용해요.',
    },
    labels: {
      name: '라벨 목록',
      control: 'object',
      description: '각 항목에 표시할 라벨을 순서대로 입력해요.',
    },
    onValueChange: {
      name: '선택 변경 동작',
      action: 'value-change',
      description: '항목을 선택하면 해당 값을 전달해요.',
    },
    items: {
      table: { disable: true },
    },
    value: {
      table: { disable: true },
    },
    defaultValue: {
      table: { disable: true },
    },
    className: {
      table: { disable: true },
    },
  },
  render: args => (
    <NavigationBarPreview
      key={`${args.itemCount}-${args.activeIndex}-${args.labels.join('-')}`}
      {...args}
    />
  ),
} satisfies Meta<NavigationBarStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 3개부터 5개까지 항목 수와 active 아이콘을 한눈에 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      {([3, 4, 5] as const).map(count => {
        const items = createItems(count, defaultLabels);

        return (
          <div key={count} style={{ display: 'grid', gap: 8 }}>
            <strong>{count}개 항목</strong>
            <NavigationBar
              aria-label={`${count}개 주요 메뉴`}
              items={items}
            />
          </div>
        );
      })}
    </div>
  ),
};

/* 항목 수·라벨·활성 위치를 바꾸고 직접 선택해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
