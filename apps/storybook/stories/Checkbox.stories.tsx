import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryCase, StoryOverview } from '../components/StoryDeviceFrame.js';
import { Checkbox } from '@/packages/ui/src/checkbox/Checkbox/Checkbox.js';

const states = [
  { name: 'Off', checked: false },
  { name: 'On', checked: true },
] as const;

const meta = {
  title: '컴포넌트/Checkbox',
  component: Checkbox,
  args: {
    'aria-label': '동의',
    defaultChecked: false,
  },
  argTypes: {
    'aria-label': {
      name: '체크박스 설명',
      control: 'text',
      description: '화면에 라벨이 없을 때 체크박스의 용도를 화면 낭독기가 읽을 수 있게 설명해요.',
    },
    defaultChecked: {
      name: '처음 선택 상태',
      control: 'boolean',
      description: '제어하지 않을 때 처음 표시할 선택 상태예요.',
    },
    checked: {
      name: '선택 (제어)',
      control: false,
      description: '외부에서 제어하는 선택 상태예요. `onChange`와 함께 사용해요.',
    },
    onChange: {
      name: '변경 동작',
      action: 'change',
      description: '선택 상태가 바뀌면 호출돼요.',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Off와 On 상태를 한눈에 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryOverview>
      {states.map(state => (
        <StoryCase key={state.name} title={state.name}>
          <Checkbox aria-label={state.name} defaultChecked={state.checked} />
        </StoryCase>
      ))}
    </StoryOverview>
  ),
};

/* 직접 눌러 선택 상태가 바뀌는지 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
