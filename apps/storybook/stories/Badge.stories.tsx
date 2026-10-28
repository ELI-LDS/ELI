import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@/packages/ui/src/badge/Badge/Badge.js';

const sizes = ['medium', 'large'] as const;

const sizeNames = {
  large: 'Large',
  medium: 'Medium',
} as const;

const meta = {
  title: '컴포넌트/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  args: {
    children: 'ELI 라이브러리',
    size: 'large',
  },
  argTypes: {
    children: {
      name: '텍스트',
      control: 'text',
      description: '배지에 표시할 내용이에요.',
    },
    size: {
      name: '크기',
      control: 'inline-radio',
      options: sizes,
      description: '배지의 크기예요.',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Medium과 Large 크기를 한눈에 확인해요. */
export const Sizes: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        alignItems: 'start',
        display: 'grid',
        fontFamily: 'var(--eli-font-family-sans, "Pretendard Variable")',
        gap: 20,
      }}
    >
      {sizes.map(size => (
        <div key={size} style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
          <span style={{ color: '#6c788a', fontSize: 12 }}>{sizeNames[size]}</span>
          <Badge size={size}>ELI 라이브러리</Badge>
        </div>
      ))}
    </div>
  ),
};

/* 공개 props를 바꿔 배지 하나를 직접 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
