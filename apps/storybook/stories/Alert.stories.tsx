import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '@/packages/ui/src/alert/Alert/Alert.js';

const statuses = ['error', 'success', 'caution', 'info'] as const;

const examples = {
  error: {
    title: '파일을 삭제할 수 없어요.',
    message: '파일 사용 권한이 없거나 다른 작업에서 사용 중일 수 있어요. 권한을 확인한 후 다시 시도해 주세요.',
  },
  success: {
    title: '파일을 삭제했어요.',
    message: '삭제된 파일은 30일 동안 휴지통에 보관돼요. 필요한 경우 휴지통에서 복구할 수 있어요.',
  },
  caution: {
    title: '체험판 기간 만료까지 1일 남았어요.',
    message: '기간이 끝나기 전에 요금제를 선택해 주세요.',
  },
  info: {
    title: '서비스 업데이트 안내',
    message: '최신 버전에서는 사용성과 안정성이 개선되었으니 업데이트 후 이용해 주세요.',
  },
} as const;

const meta = {
  title: '컴포넌트/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  args: {
    message: examples.info.message,
    status: 'info',
    title: examples.info.title,
  },
  argTypes: {
    title: {
      name: '제목',
      control: 'text',
      description: '알림 제목이에요.',
    },
    message: {
      name: '본문',
      control: 'text',
      description: '제목 아래에 표시할 본문이에요. 비우면 제목만 표시해요.',
    },
    status: {
      name: '상태',
      control: 'inline-radio',
      options: statuses,
      description: '상태에 맞는 색상과 아이콘을 표시해요.',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 네 가지 상태를 한눈에 확인해요. */
export const Statuses: Story = {
  name: '상태별 보기',
  render: () => (
    <div
      style={{
        display: 'grid',
        fontFamily: 'var(--eli-font-family-sans, "Pretendard Variable")',
        gap: 24,
      }}
    >
      {statuses.map(status => (
        <div key={status} style={{ display: 'grid', gap: 8 }}>
          <span style={{ color: '#6c788a', fontSize: 12 }}>{status}</span>
          <Alert message={examples[status].message} status={status} title={examples[status].title} />
        </div>
      ))}
    </div>
  ),
};

/* 공개 props를 바꿔 알림 하나를 직접 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
