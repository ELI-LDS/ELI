import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/packages/ui/src/button/Button/Button.js';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: {
    children: 'Button',
    color: 'primary',
    size: 'medium',
    variant: 'solid',
  },
  argTypes: {
    children: {
      control: 'text',
      description: '버튼에 표시할 내용이에요.',
    },
    icon: {
      control: false,
      description: '버튼 왼쪽 아이콘이에요. 기본값은 Plus 아이콘이에요.',
    },
    backgroundColor: {
      control: 'color',
      description: '기본 스타일보다 우선해 적용할 배경색이에요.',
    },
    width: {
      control: 'text',
      description: '버튼의 가로 크기예요. px, %, rem 같은 CSS 값을 사용할 수 있어요.',
    },
    height: {
      control: 'text',
      description: '버튼의 세로 크기예요. 크기별 기본 높이보다 우선해요.',
    },
    color: {
      control: 'inline-radio',
      options: ['primary', 'tertiary'],
      description: '버튼의 색상 조합이에요.',
    },
    size: {
      control: 'inline-radio',
      options: ['large', 'medium'],
      description: '버튼의 기본 크기예요.',
    },
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'ghost'],
      description: '버튼의 형태예요.',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Controls에서 공개 props를 바꿔 확인해요. */
export const Playground: Story = {};

/* 아이콘이 필요 없는 버튼을 확인해요. */
export const WithoutIcon: Story = {
  args: { icon: null },
};

/* 사용자가 지정한 배경색과 크기를 확인해요. */
export const CustomSizeAndBackground: Story = {
  args: {
    backgroundColor: '#153464',
    children: '커스텀 버튼',
    height: 56,
    width: 240,
  },
};

/* 색상과 형태의 전체 조합을 확인해요. */
export const Variants: Story = {
  render: () => {
    const colors = ['primary', 'tertiary'] as const;
    const variants = ['solid', 'outline', 'ghost'] as const;

    return (
      <div style={{ display: 'grid', gap: 16 }}>
        {colors.map(color => (
          <div key={color} style={{ display: 'flex', gap: 12 }}>
            {variants.map(variant => (
              <Button color={color} key={variant} variant={variant}>
                Button
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

/* 비활성화된 전체 조합을 확인해요. */
export const Disabled: Story = {
  render: () => {
    const colors = ['primary', 'tertiary'] as const;
    const variants = ['solid', 'outline', 'ghost'] as const;

    return (
      <div style={{ display: 'grid', gap: 16 }}>
        {colors.map(color => (
          <div key={color} style={{ display: 'flex', gap: 12 }}>
            {variants.map(variant => (
              <Button color={color} disabled key={variant} variant={variant}>
                Button
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  },
};
