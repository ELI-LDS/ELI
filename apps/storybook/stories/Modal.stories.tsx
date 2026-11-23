import { useArgs } from 'storybook/preview-api';
import { Button } from '@/packages/ui/src/button/Button/Button.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from '@/packages/ui/src/modal/Modal/Modal.js';

const meta = {
  title: '컴포넌트/Modal',
  component: Modal,
  args: {
    // 직접 바꿔보기는 열기 버튼부터 눌러 닫기와 재열기를 확인해요.
    open: false,
    title: '제목',
    message: '내용을 작성합니다',
    subMessage: '내용을 작성합니다',
    positiveAction: '버튼',
    secondaryAction: '모달 닫기',
    width: '343px',
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <>
        <Button icon={null} onClick={() => updateArgs({ open: true })}>
          모달 열기
        </Button>
        <Modal
          {...args}
          onOpenChange={open => {
            args.onOpenChange?.(open);
            updateArgs({ open });
          }}
        />
      </>
    );
  },
  argTypes: {
    open: { name: '표시하기', control: 'boolean', description: '열기 버튼으로 표시하고 Dim·모달 닫기·Esc로 닫아요. Controls에도 현재 표시 상태가 반영돼요.' },
    defaultOpen: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    title: {
      name: '제목',
      control: 'text',
      description: '모달 상단에 표시할 제목이에요.',
    },
    message: {
      name: '첫 번째 내용',
      control: 'text',
      description: '제목 아래 첫 번째 문장으로 표시할 내용이에요.',
    },
    subMessage: {
      name: '두 번째 내용',
      control: 'text',
      description: '제목 아래 두 번째 문장으로 표시할 내용이에요.',
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
      description: '내부 대화상자의 가로 크기예요. 작은 화면의 가용 너비를 넘지 않도록 제한해요. 화면 전체 루트의 style.width와는 적용 대상이 달라요.',
    },
    height: {
      name: '세로 크기',
      control: 'text',
      description: '내부 대화상자의 세로 크기예요. 화면 전체 루트의 style.height와는 적용 대상이 달라요.',
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

/* 기본 텍스트와 두 버튼으로 구성된 Modal 전체 UI를 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  args: { open: true },
  parameters: { controls: { disable: true } },
};

/* 공개 props를 바꿔 Modal 하나를 직접 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
