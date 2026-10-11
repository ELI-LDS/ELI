import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from '@/packages/ui/src/text/TextArea/TextArea.js';

const meta = {
  title: '컴포넌트/TextArea',
  component: TextArea,
  parameters: { layout: 'centered' },
  args: {
    label: '라벨',
    placeholder: '내용을 입력하세요',
  },
  argTypes: {
    label: {
      name: '라벨',
      control: 'text',
      description: '입력 영역 위에 표시할 라벨이에요.',
    },
    placeholder: {
      name: 'Placeholder 문구',
      control: 'text',
      description: '값을 입력하기 전에 입력 영역에 표시할 안내 문구예요.',
    },
    disabled: {
      table: { disable: true },
    },
    defaultValue: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Figma의 기본·입력 완료·비활성화 상태와 실제 Hover·Focus를 확인해요. */
export const States: Story = {
  name: '상태별 보기',
  parameters: { controls: { disable: true } },
  render: args => (
    <div
      style={{
        display: 'grid',
        fontFamily: 'var(--eli-font-family-sans, "Pretendard Variable")',
        gap: 24,
      }}
    >
      <p style={{ color: '#4b5668', margin: 0 }}>
        기본 입력 영역에 마우스를 올리거나 선택해 Hover와 Focus 상태를 확인해요.
      </p>

      <div style={{ display: 'grid', gap: 8 }}>
        <strong>기본</strong>
        <TextArea {...args} />
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <strong>입력 완료</strong>
        <TextArea {...args} defaultValue="내용을 입력했어요" />
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <strong>비활성화</strong>
        <TextArea {...args} disabled />
      </div>
    </div>
  ),
};

/* 라벨과 Placeholder 문구를 바꿔 Text Area 하나를 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  parameters: { controls: { include: ['label', 'placeholder'] } },
};
