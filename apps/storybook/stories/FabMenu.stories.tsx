import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import {
  StoryCase,
  StoryDeviceFrame,
  StoryOverview,
  StoryPreviewLayout,
} from '../components/StoryDeviceFrame.js';
import { FabMenu } from '@/packages/ui/src/fab/FabMenu/FabMenu.js';
import type { FabMenuItem } from '@/packages/ui/src/fab/FabMenu/FabMenu.types.js';
import './FabMenu.stories.css';

const createItems = (count: number): FabMenuItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `action-${index + 1}`,
    label: `${index + 1}번째 액션`,
  }));

function FabMenuPreview({
  expanded,
  items,
  label,
  onExpandedChange,
  showLabel,
}: {
  expanded: boolean;
  items: readonly FabMenuItem[];
  label: string;
  onExpandedChange?: (expanded: boolean) => void;
  showLabel: boolean;
}) {
  return (
    <>
      <div
        aria-hidden="true"
        className="eli-fab-story__dim"
        data-visible={expanded}
      />
      <FabMenu
        className="eli-fab-story__menu"
        expanded={expanded}
        items={items}
        label={label}
        showLabel={showLabel}
        {...(onExpandedChange === undefined ? {} : { onExpandedChange })}
      />
    </>
  );
}

function ExampleScreen(props: Parameters<typeof FabMenuPreview>[0]) {
  return (
    <StoryDeviceFrame label="FAB Menu 미리보기">
      <FabMenuPreview {...props} />
    </StoryDeviceFrame>
  );
}

const meta = {
  title: '컴포넌트/FabMenu',
  component: FabMenu,
  args: {
    expanded: false,
    items: createItems(1),
    label: '버튼',
    showLabel: true,
  },
  argTypes: {
    items: {
      name: '메뉴 항목',
      control: 'object',
      description: '`id`와 `label`을 가진 액션을 한 개 이상 추가하고 각 이름을 수정해요.',
    },
    label: {
      name: '기본 버튼 이름',
      control: 'text',
      description: '메뉴가 닫혔을 때 메인 FAB에 표시하고 화면 낭독기에 전달할 이름이에요.',
    },
    showLabel: {
      name: '기본 버튼 이름 표시',
      control: 'boolean',
      description: '메뉴가 닫혔을 때 메인 FAB의 이름을 화면에도 표시할지 정해요.',
    },
    expanded: {
      name: '메뉴 열림',
      control: 'boolean',
      description: '메인 FAB를 누르거나 이 값을 바꿔 메뉴를 열고 닫아요.',
    },
    defaultExpanded: { table: { disable: true } },
    onExpandedChange: {
      name: '열림 상태 변경',
      action: 'expanded-change',
      description: '메뉴가 열리거나 닫힐 때 다음 상태를 전달해요.',
    },
    icon: { table: { disable: true } },
    expandedIcon: { table: { disable: true } },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof FabMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 예시 화면의 우측 아래에서 닫힘·열림 상태를 함께 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryOverview description="닫힘과 열림 상태를 각각 모바일 화면의 우측 하단에서 확인해요.">
      <StoryCase title="닫힘">
        <ExampleScreen
          expanded={false}
          items={createItems(3)}
          label="버튼"
          showLabel={false}
        />
      </StoryCase>
      <StoryCase title="열림">
        <ExampleScreen
          expanded
          items={createItems(3)}
          label="버튼"
          showLabel={false}
        />
      </StoryCase>
    </StoryOverview>
  ),
};

/* 기본 버튼 이름과 메뉴 항목을 편집하고 실제 열기·닫기를 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const nextItemId = useRef(args.items.length + 1);
    const expanded = args.expanded ?? false;
    const label = args.label ?? '버튼';
    const showLabel = args.showLabel ?? true;

    const updateItemLabel = (id: string, label: string) => {
      updateArgs({
        items: args.items.map(item => item.id === id ? { ...item, label } : item),
      });
    };

    const addItem = () => {
      const index = nextItemId.current;
      nextItemId.current += 1;
      updateArgs({
        items: [...args.items, { id: `action-${index}`, label: `${index}번째 액션` }],
      });
    };

    const removeItem = (id: string) => {
      if (args.items.length === 1) return;
      updateArgs({ items: args.items.filter(item => item.id !== id) });
    };

    const editor = (
      <div className="eli-fab-story__editor">
          <label>
            <span>기본 버튼 이름</span>
            <input
              onChange={event => updateArgs({ label: event.currentTarget.value })}
              value={label}
            />
          </label>
          <label className="eli-fab-story__checkbox">
            <input
              checked={showLabel}
              onChange={event => updateArgs({ showLabel: event.currentTarget.checked })}
              type="checkbox"
            />
            <span>기본 버튼 이름 표시</span>
          </label>

          <div className="eli-fab-story__item-editor">
            <strong>FAB Menu 항목</strong>
            {args.items.map((item, index) => (
              <div className="eli-fab-story__item-row" key={item.id}>
                <input
                  aria-label={`${index + 1}번째 메뉴 이름`}
                  onChange={event => updateItemLabel(item.id, event.currentTarget.value)}
                  value={item.label}
                />
                <label>
                  <input
                    aria-label={`${index + 1}번째 메뉴 비활성화`}
                    checked={item.disabled ?? false}
                    onChange={event => {
                      const disabled = event.currentTarget.checked;
                      updateArgs({ items: args.items.map(current => current.id === item.id ? { ...current, disabled } : current) });
                    }}
                    type="checkbox"
                  />
                  비활성화
                </label>
                <button
                  aria-label={`${item.label} 삭제`}
                  disabled={args.items.length === 1}
                  onClick={() => removeItem(item.id)}
                  type="button"
                >
                  삭제
                </button>
              </div>
            ))}
            <button onClick={addItem} type="button">메뉴 항목 추가</button>
          </div>
      </div>
    );

    return (
      <StoryPreviewLayout device="mobile" editor={editor} label="FAB Menu 직접 바꿔보기">
        <FabMenuPreview
          expanded={expanded}
          items={args.items}
          label={label}
          onExpandedChange={nextExpanded => {
            args.onExpandedChange?.(nextExpanded);
            updateArgs({ expanded: nextExpanded });
          }}
          showLabel={showLabel}
        />
      </StoryPreviewLayout>
    );
  },
};
