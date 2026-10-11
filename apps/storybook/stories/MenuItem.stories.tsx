import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronForwardIcon } from '@/packages/ui/src/icon/ChevronForwardIcon.js';
import { XIcon } from '@/packages/ui/src/icon/XIcon.js';
import { MenuItem } from '@/packages/ui/src/menu/MenuItem/MenuItem.js';

const meta = {
  title: '컴포넌트/MenuItem',
  component: MenuItem,
  parameters: { layout: 'centered' },
  args: {
    children: '선택',
    shortcut: '⇧⌘P',
  },
  argTypes: {
    children: {
      name: '텍스트',
      control: 'text',
      description: '메뉴 항목에 표시할 내용이에요.',
    },
    shortcut: {
      name: '단축키',
      control: 'text',
      description: '오른쪽 영역에 표시할 단축키예요.',
    },
    leftIcon: {
      table: { disable: true },
    },
    rightIcon: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof MenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 아이콘과 단축키 조합을 한눈에 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: args => (
    <div style={{ display: 'grid', gap: 12, width: 'min(332px, calc(100vw - 32px))' }}>
      <MenuItem {...args} shortcut={null} />
      <MenuItem {...args} leftIcon={<XIcon />} shortcut={null} />
      <MenuItem {...args} rightIcon={<ChevronForwardIcon />} shortcut={null} />
      <MenuItem {...args} leftIcon={<XIcon />} rightIcon={<ChevronForwardIcon />} />
    </div>
  ),
};

/* 항목에 마우스를 올리거나 누르고 있는 동안 Hover와 Pressed 상태를 확인해요. */
export const States: Story = {
  name: '상태별 보기',
  parameters: { controls: { disable: true } },
  render: args => (
    <div style={{ display: 'grid', gap: 16, width: 'min(332px, calc(100vw - 32px))' }}>
      <p style={{ color: '#4b5668', margin: 0 }}>
        메뉴 항목에 마우스를 올리거나 누르고 있는 동안 상태 변화를 확인해요.
      </p>
      <MenuItem {...args} shortcut={null} />
    </div>
  ),
};

/* 텍스트와 단축키를 바꿔 MenuItem 하나를 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  parameters: { controls: { include: ['children', 'shortcut'] } },
  render: args => (
    <div style={{ width: 'min(332px, calc(100vw - 32px))' }}>
      <MenuItem {...args} leftIcon={<XIcon />} rightIcon={<ChevronForwardIcon />} />
    </div>
  ),
};
