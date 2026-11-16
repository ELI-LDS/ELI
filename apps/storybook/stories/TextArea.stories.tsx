import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryCase, StoryOverview } from '../components/StoryDeviceFrame.js';
import { TextArea } from '@/packages/ui/src/text/TextArea/TextArea.js';

const meta = {
  title: '컴포넌트/TextArea',
  component: TextArea,
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
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: args => (
    <StoryOverview description="기본 입력 영역에 마우스를 올리거나 선택해 Hover와 Focus 상태를 확인해요.">
      <StoryCase title="기본">
        <TextArea {...args} />
      </StoryCase>
      <StoryCase title="입력 완료">
        <TextArea {...args} defaultValue="내용을 입력했어요" />
      </StoryCase>
      <StoryCase title="비활성화">
        <TextArea {...args} disabled />
      </StoryCase>
    </StoryOverview>
  ),
};

/* 라벨과 Placeholder 문구를 바꿔 Text Area 하나를 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  parameters: { controls: { include: ['라벨', 'Placeholder 문구'] } },
};
