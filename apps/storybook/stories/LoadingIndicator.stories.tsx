import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingIndicator } from '@/packages/ui/src/loading/LoadingIndicator/LoadingIndicator.js';

const progressOptions = [undefined, 0, 10, 30, 50, 80, 100] as const;

const meta = {
  title: '컴포넌트/LoadingIndicator',
  component: LoadingIndicator,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': '콘텐츠 불러오는 중',
  },
  argTypes: {
    'aria-label': {
      name: '진행 상태 설명',
      control: 'text',
      description: '화면 낭독기가 어떤 작업이 진행 중인지 읽을 수 있게 설명해요.',
    },
    progress: {
      name: '진행률',
      control: 'select',
      options: progressOptions,
      labels: {
        undefined: '진행률을 모름',
        0: '0%',
        10: '10%',
        30: '30%',
        50: '50%',
        80: '80%',
        100: '100%',
      },
      description: '완료 비율을 알면 값을 고르고, 알 수 없으면 비워 반복 애니메이션을 사용해요.',
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof LoadingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 반복 애니메이션과 퍼센트별 원형 상태를 함께 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {progressOptions.map(progress => (
        <div
          key={progress ?? 'indeterminate'}
          style={{ display: 'grid', gap: 8, justifyItems: 'center' }}
        >
          <span style={{ color: '#6c788a', fontSize: 12 }}>
            {progress === undefined ? 'Indeterminate' : `${progress}%`}
          </span>
          <LoadingIndicator
            aria-label={progress === undefined ? '진행률을 모르는 작업' : `${progress}% 완료`}
            {...(progress === undefined ? {} : { progress })}
          />
        </div>
      ))}
    </div>
  ),
};

/* 진행 상태 설명과 진행률을 바꿔 직접 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
