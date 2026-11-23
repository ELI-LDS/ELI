import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryCase, StoryOverview } from '../components/StoryDeviceFrame.js';
import { ProgressIndicator } from '@/packages/ui/src/loading/ProgressIndicator/ProgressIndicator.js';

const progressOptions = [undefined, 0, 10, 30, 50, 80, 100] as const;

const meta = {
  title: '컴포넌트/ProgressIndicator',
  component: ProgressIndicator,
  args: {
    'aria-label': '파일 업로드 진행 상태',
  },
  argTypes: {
    'aria-label': {
      name: '진행 상태 설명',
      control: 'text',
      description: '화면 낭독기가 어떤 작업이 진행 중인지 읽을 수 있게 설명해요.',
    },
    progress: {
      name: '진행률',
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: '0~100 사이의 숫자를 입력해요. 값을 비우면 진행률을 모르는 반복 애니메이션을 표시해요.',
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof ProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 반복 애니메이션과 퍼센트별 막대 상태를 함께 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryOverview>
      {progressOptions.map(progress => (
        <StoryCase
          key={progress ?? 'indeterminate'}
          title={progress === undefined ? 'Indeterminate' : `${progress}%`}
        >
          <div style={{ width: 343 }}>
          <ProgressIndicator
            aria-label={progress === undefined ? '진행률을 모르는 작업' : `${progress}% 완료`}
            {...(progress === undefined ? {} : { progress })}
          />
          </div>
        </StoryCase>
      ))}
    </StoryOverview>
  ),
};

/* 진행 상태 설명과 진행률을 바꿔 직접 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  decorators: [Story => (
    <div style={{ width: 343 }}>
      <Story />
    </div>
  )],
};
