import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronForwardIcon } from '@/packages/ui/src/icon/ChevronForwardIcon.js';
import { XIcon } from '@/packages/ui/src/icon/XIcon.js';
import { MenuItem } from '@/packages/ui/src/menu/MenuItem/MenuItem.js';
import type { MenuItemProps } from '@/packages/ui/src/menu/MenuItem/MenuItem.types.js';

interface MenuItemStoryArgs extends MenuItemProps {
  showLeftIcon: boolean;
  showRightIcon: boolean;
}

const meta = {
  title: '컴포넌트/MenuItem',
  component: MenuItem,
  parameters: { layout: 'centered' },
  args: {
    children: '선택',
    disabled: false,
    showLeftIcon: false,
    showRightIcon: true,
    shortcut: '⇧⌘P',
  },
  argTypes: {
    children: {
      name: '텍스트',
      control: 'text',
      description: '메뉴 항목에 표시할 내용이에요.',
    },
    showLeftIcon: {
      name: '왼쪽 아이콘 표시',
      control: 'boolean',
      description: '`true`면 텍스트 왼쪽에 예시 아이콘을 표시해요.',
    },
    showRightIcon: {
      name: '오른쪽 아이콘 표시',
      control: 'boolean',
      description: '`true`면 텍스트 오른쪽에 예시 아이콘을 표시해요.',
    },
    shortcut: {
      name: '단축키 안내',
      control: 'text',
      description: '오른쪽에 표시할 단축키 안내예요. 실제 키보드 동작은 별도로 연결해요.',
    },
    disabled: {
      name: '비활성화',
      control: 'boolean',
      description: '`true`면 메뉴 항목을 선택할 수 없어요.',
    },
    leftIcon: {
      table: { disable: true },
    },
    rightIcon: {
      table: { disable: true },
    },
    className: {
      table: { disable: true },
    },
  },
  render: ({ showLeftIcon, showRightIcon, ...args }) => (
    <MenuItem
      {...args}
      leftIcon={showLeftIcon ? <XIcon /> : undefined}
      rightIcon={showRightIcon ? <ChevronForwardIcon /> : undefined}
    />
  ),
} satisfies Meta<MenuItemStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 좌우 아이콘과 단축키 안내 조합을 한눈에 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: ({ children }) => (
    <div style={{ display: 'grid', gap: 16, width: 'min(332px, calc(100vw - 32px))' }}>
      <p style={{ color: '#4b5668', margin: 0 }}>
        각 항목에 마우스를 올리거나 누른 채로 Hover와 Pressed 상태를 확인해요.
      </p>
      <MenuItem>{children}</MenuItem>
      <MenuItem leftIcon={<XIcon />}>{children}</MenuItem>
      <MenuItem rightIcon={<ChevronForwardIcon />}>{children}</MenuItem>
      <MenuItem shortcut="⇧⌘P">{children}</MenuItem>
      <MenuItem leftIcon={<XIcon />} rightIcon={<ChevronForwardIcon />}>
        {children}
      </MenuItem>
      <MenuItem disabled rightIcon={<ChevronForwardIcon />}>
        {children}
      </MenuItem>
    </div>
  ),
};

/* 텍스트, 좌우 아이콘 표시 여부와 단축키 안내를 바꿔 MenuItem 하나를 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  decorators: [
    Story => (
      <div style={{ width: 'min(332px, calc(100vw - 32px))' }}>
        <Story />
      </div>
    ),
  ],
};
