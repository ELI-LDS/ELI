import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from '@/packages/ui/src/modal/Modal/Modal.js';

const meta = {
  title: '컴포넌트/모달',
  component: Modal,
  parameters: { layout: 'fullscreen' },
  args: {
    title: '제목',
    children: '내용을 작성합니다\n내용을 작성합니다',
    positiveAction: '버튼',
    secondaryAction: '버튼',
    width: '343px',
  },
  argTypes: {
    title: {
      name: '제목',
      control: 'text',
      description: '모달 상단에 표시할 제목이에요.',
    },
    children: {
      name: '텍스트',
      control: 'text',
      description: '제목 아래에 표시할 내용이에요. 줄바꿈을 입력해 여러 줄로 표시할 수 있어요.',
    },
    positiveAction: {
      name: 'Positive 버튼명',
      control: 'text',
      description: '오른쪽 메인 버튼에 표시할 내용이에요.',
    },
    secondaryAction: {
      name: 'Secondary 버튼명',
      control: 'text',
      description: '왼쪽 보조 버튼에 표시할 내용이에요.',
    },
    width: {
      name: '가로 크기',
      control: 'text',
      description: '모달 콘텐츠의 가로 크기예요. 작은 화면의 너비를 넘지 않아요.',
    },
    height: {
      name: '세로 크기',
      control: 'text',
      description: '모달 콘텐츠의 세로 크기예요.',
    },
    onPositiveAction: {
      table: { disable: true },
    },
    onSecondaryAction: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 공개 props를 바꿔 Modal 하나를 직접 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
