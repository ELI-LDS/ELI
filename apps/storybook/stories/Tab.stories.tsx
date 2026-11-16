import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { StoryCase, StoryOverview } from '../components/StoryDeviceFrame.js';
import { Tab } from '@/packages/ui/src/tab/Tab/Tab.js';

const meta = {
  title: '컴포넌트/Tab',
  component: Tab,
  args: {
    active: true,
    defaultActive: true,
    label: '탭 이름',
  },
  argTypes: {
    label: {
      name: '탭 이름',
      control: 'text',
      description: 'Tab에 표시할 한 줄 이름이에요.',
    },
    active: {
      name: '선택 상태',
      control: 'boolean',
      description: '`true`이면 현재 선택된 Tab의 글자색과 2px 하단 선을 사용해요.',
    },
    defaultActive: {
      name: '처음 선택 상태',
      control: 'boolean',
      description: '`active`를 직접 제어하지 않을 때 처음 표시할 선택 상태예요.',
    },
    onActiveChange: {
      name: '선택 상태 변경',
      action: 'activeChange',
      description: 'Tab을 누르면 다음 선택 상태를 전달해요.',
    },
    onClick: {
      name: '선택 동작',
      action: 'click',
      description: 'Tab을 선택했을 때 실행할 함수예요.',
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 선택·비선택 상태와 실제 Hover·Pressed 상호작용을 함께 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryOverview description="각 Tab에 마우스를 올리거나 누른 채로 Hover와 Pressed를 확인해요.">
      <StoryCase title="선택 상태 비교">
        <div aria-label="예시 탭" role="tablist" style={{ display: 'flex' }}>
          <Tab active label="탭 이름" />
          <Tab active={false} label="탭 이름" />
        </div>
      </StoryCase>
    </StoryOverview>
  ),
};

/* 이름과 선택 상태를 바꾸고 직접 눌러 동작을 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <div aria-label="예시 탭" role="tablist">
        <Tab
          {...args}
          onActiveChange={nextActive => {
            args.onActiveChange?.(nextActive);
            updateArgs({ active: nextActive });
          }}
        />
      </div>
    );
  },
};
