import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from '@/packages/ui/src/radio/Radio/Radio.js';

const meta = {
  title: '컴포넌트/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': '선택지',
    defaultChecked: false,
    name: 'storybook-radio',
    value: 'option',
  },
  argTypes: {
    'aria-label': {
      name: '선택지 설명',
      control: 'text',
      description: '화면에 라벨이 없을 때 선택지의 의미를 화면 낭독기가 읽을 수 있게 설명해요.',
    },
    name: {
      name: '선택 묶음 이름',
      control: 'text',
      description: '하나만 선택할 Radio가 같은 값을 공유해요.',
    },
    value: {
      name: '선택 값',
      control: 'text',
      description: 'Radio가 선택됐을 때 폼에 전달할 값이에요.',
    },
    defaultChecked: {
      name: '처음 선택 상태',
      control: 'boolean',
      description: '제어하지 않을 때 처음 선택되어 있을지 정해요.',
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
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Off와 On 디자인, 같은 name 안에서 하나만 선택되는 동작을 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <fieldset
      style={{
        border: 0,
        display: 'grid',
        gap: 12,
        margin: 0,
        padding: 0,
      }}
    >
      <legend style={{ marginBottom: 12 }}>관심 분야</legend>
      {['프론트엔드', '백엔드', '디자인'].map((label, index) => (
        <label
          key={label}
          style={{ alignItems: 'center', display: 'flex', gap: 8 }}
        >
          <Radio
            defaultChecked={index === 1}
            name="interest"
            value={label}
          />
          {label}
        </label>
      ))}
    </fieldset>
  ),
};

/* 선택지 설명·묶음 이름·값·처음 선택 상태를 바꿔 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
