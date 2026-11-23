import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryCase, StoryOverview } from '../components/StoryDeviceFrame.js';
import { LoadingIndicator } from '@/packages/ui/src/loading/LoadingIndicator/LoadingIndicator.js';

const progressOptions = [undefined, 0, 10, 30, 50, 80, 100] as const;
const indeterminateVariants = [
  { label: 'Continuous', variant: 'continuous' },
  { label: 'Cycle (2초)', variant: 'cycle' },
] as const;

const meta = {
  title: '컴포넌트/LoadingIndicator',
  component: LoadingIndicator,
  args: {
    'aria-label': '콘텐츠 불러오는 중',
    variant: 'continuous',
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
    variant: {
      name: '반복 방식',
      control: 'select',
      options: ['continuous', 'cycle'],
      description: '진행률을 모를 때 일정한 회전 또는 Figma의 2초 가감속 반복을 선택해요.',
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof LoadingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 두 반복 방식과 퍼센트별 원형 상태를 함께 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryOverview>
      {indeterminateVariants.map(({ label, variant }) => (
        <StoryCase key={variant} title={label}>
          <LoadingIndicator
            aria-label={`${label} 방식으로 진행 중`}
            variant={variant}
          />
        </StoryCase>
      ))}
      {progressOptions.filter(progress => progress !== undefined).map(progress => (
        <StoryCase key={progress} title={`${progress}%`}>
          <LoadingIndicator aria-label={`${progress}% 완료`} progress={progress} />
        </StoryCase>
      ))}
    </StoryOverview>
  ),
};

/* 진행 상태 설명·진행률·반복 방식을 바꿔 직접 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
