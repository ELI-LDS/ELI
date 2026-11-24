import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import {
  StoryCase,
  StoryDeviceFrame,
  StoryOverview,
  StoryPreviewLayout,
} from '../components/StoryDeviceFrame.js';
import { HomeFilledIcon } from '@/packages/ui/src/icon/HomeFilledIcon.js';
import { HomeOutlinedIcon } from '@/packages/ui/src/icon/HomeOutlinedIcon.js';
import { NavigationBarGlass } from '@/packages/ui/src/navigation/NavigationBarGlass/NavigationBarGlass.js';
import type {
  NavigationBarGlassOption,
  NavigationBarGlassOptions,
  NavigationBarGlassProps,
} from '@/packages/ui/src/navigation/NavigationBarGlass/NavigationBarGlass.types.js';
import './NavigationBarGlass.stories.css';

type NavigationBarGlassStoryArgs = NavigationBarGlassProps & {
  activeIndex: number;
  itemCount: 3 | 4 | 5;
  labels: string[];
};

type NavigationBarGlassPreviewProps = Pick<
  NavigationBarGlassProps,
  'aria-label' | 'className' | 'defaultValue' | 'onValueChange' | 'value'
> & Pick<NavigationBarGlassStoryArgs, 'activeIndex' | 'itemCount' | 'labels'>;

const defaultLabels = ['홈', '검색', '알림', '저장', '내 정보'];

function createOption(label: string, index: number): NavigationBarGlassOption {
  return {
    value: `item-${index + 1}`,
    label,
    outlinedIcon: <HomeOutlinedIcon />,
    filledIcon: <HomeFilledIcon />,
  };
}

function createItems(
  count: 3 | 4 | 5,
  labels: string[],
): NavigationBarGlassOptions {
  const item = (index: number) => createOption(
    labels[index] ?? `항목 ${index + 1}`,
    index,
  );

  if (count === 3) return [item(0), item(1), item(2)];
  if (count === 4) return [item(0), item(1), item(2), item(3)];
  return [item(0), item(1), item(2), item(3), item(4)];
}

function NavigationBarGlassPreview({
  activeIndex,
  itemCount,
  labels,
  onValueChange,
  ...navigationBarProps
}: NavigationBarGlassPreviewProps) {
  const items = createItems(itemCount, labels);
  const initialIndex = Math.min(Math.max(activeIndex, 0), items.length - 1);
  const initialItem = items[initialIndex] ?? items[0];
  const [value, setValue] = useState(initialItem?.value ?? '');

  return (
    <NavigationBarGlass
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

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

const meta = {
  title: '컴포넌트/NavigationBarGlass',
  component: NavigationBarGlass,
  args: {
    'aria-label': '주요 메뉴',
    activeIndex: 0,
    itemCount: 3,
    items: createItems(3, defaultLabels),
    labels: defaultLabels.slice(0, 3),
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
      description: '권장 범위인 3~5개를 미리보기에서 선택해요. 실제 컴포넌트는 개수를 강제로 제한하지 않아요.',
    },
    activeIndex: {
      name: '처음 활성화할 순서',
      control: { type: 'number', min: 0, max: 4, step: 1 },
      description: '0부터 시작하는 활성 항목의 순서예요. 항목 수보다 크면 마지막 항목을 사용해요.',
    },
    labels: {
      name: '접근성 라벨 목록',
      control: 'object',
      description: '화면에는 보이지 않고 화면 낭독기에 전달할 라벨을 순서대로 입력해요.',
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
    <StoryDeviceFrame label="Glass Navigation Bar 직접 바꿔보기" placement="bottom">
      <NavigationBarGlassPreview
        key={`${args.itemCount}-${args.activeIndex}-${args.labels.join('-')}`}
        {...args}
      />
    </StoryDeviceFrame>
  ),
} satisfies Meta<NavigationBarGlassStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 3·4·5개 항목과 각 항목 수의 활성 indicator 위치를 비교해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryOverview description="항목 수에 따른 너비와 활성 indicator 위치를 비교해요.">
      {([3, 4, 5] as const).map(count => (
        <StoryCase key={count} title={`${count}개 항목`}>
          <StoryDeviceFrame label={`${count}개 Glass Navigation Bar 미리보기`} placement="bottom">
            <NavigationBarGlass
              aria-label={`${count}개 주요 메뉴`}
              items={createItems(count, defaultLabels)}
            />
          </StoryDeviceFrame>
        </StoryCase>
      ))}
    </StoryOverview>
  ),
};

/* 항목 수·접근성 라벨과 활성 위치를 바꾸고 탭·드래그로 선택해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const nextItemNumber = useRef(args.itemCount + 1);
    const itemCount = args.itemCount;
    const activeIndex = clamp(args.activeIndex, 0, itemCount - 1);
    const labels = args.labels.slice(0, itemCount);

    const updateLabel = (index: number, label: string) => {
      updateArgs({
        labels: labels.map((currentLabel, currentIndex) => (
          currentIndex === index ? label : currentLabel
        )),
      });
    };

    const addItem = () => {
      if (itemCount >= 5) return;

      const itemNumber = nextItemNumber.current;
      nextItemNumber.current += 1;
      updateArgs({
        itemCount: itemCount + 1,
        labels: [...labels, `${itemNumber}번째 메뉴`],
      });
    };

    const removeItem = (index: number) => {
      if (itemCount <= 3) return;

      const nextLabels = labels.filter((_, currentIndex) => currentIndex !== index);
      const nextItemCount = itemCount - 1;
      updateArgs({
        activeIndex: Math.min(activeIndex, nextItemCount - 1),
        itemCount: nextItemCount,
        labels: nextLabels,
      });
    };

    const editor = (
      <div className="eli-navigation-bar-glass-story__editor">
          <label>
            <span>탐색 영역 설명</span>
            <input
              onChange={event => updateArgs({
                'aria-label': event.currentTarget.value,
              })}
              value={args['aria-label']}
            />
          </label>

          <label>
            <span>활성 메뉴</span>
            <select
              onChange={event => updateArgs({
                activeIndex: Number(event.currentTarget.value),
              })}
              value={activeIndex}
            >
              {labels.map((label, index) => (
                <option key={`${index}-${label}`} value={index}>
                  {label || `${index + 1}번째 메뉴`}
                </option>
              ))}
            </select>
          </label>

          <div className="eli-navigation-bar-glass-story__item-editor">
            <strong>메뉴 항목</strong>
            <p className="eli-navigation-bar-glass-story__hint">
              미리보기는 권장 범위인 3~5개로 구성해요.
            </p>
            {labels.map((label, index) => (
              <div className="eli-navigation-bar-glass-story__item-row" key={index}>
                <input
                  aria-label={`${index + 1}번째 메뉴 설명`}
                  onChange={event => updateLabel(index, event.currentTarget.value)}
                  value={label}
                />
                <button
                  aria-label={`${label || `${index + 1}번째 메뉴`} 삭제`}
                  disabled={itemCount <= 3}
                  onClick={() => removeItem(index)}
                  type="button"
                >
                  삭제
                </button>
              </div>
            ))}
            <button disabled={itemCount >= 5} onClick={addItem} type="button">
              메뉴 항목 추가
            </button>
          </div>
      </div>
    );

    return (
      <StoryPreviewLayout
        device="mobile"
        editor={editor}
        label="Glass Navigation Bar 직접 바꿔보기"
        placement="bottom"
      >
        <NavigationBarGlassPreview
          aria-label={args['aria-label']}
          activeIndex={activeIndex}
          key={`${itemCount}-${activeIndex}-${labels.join('-')}`}
          itemCount={itemCount}
          labels={labels}
          {...(args.defaultValue === undefined ? {} : { defaultValue: args.defaultValue })}
          {...(args.onValueChange === undefined ? {} : { onValueChange: args.onValueChange })}
          {...(args.value === undefined ? {} : { value: args.value })}
        />
      </StoryPreviewLayout>
    );
  },
};
