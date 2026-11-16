import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryCase, StoryOverview } from '../components/StoryDeviceFrame.js';
import { IconButton } from '@/packages/ui/src/button/IconButton/IconButton.js';

const colors = ['brand', 'neutral'] as const;
const sizes = ['large', 'medium'] as const;
const variants = ['solid', 'outline'] as const;

const colorNames = {
  brand: 'Brand',
  neutral: 'Neutral',
} as const;

const sizeNames = {
  large: 'Large',
  medium: 'Medium',
} as const;

const variantNames = {
  solid: 'Solid',
  outline: 'Outline',
} as const;

interface IconButtonGalleryProps {
  description: string;
  disabled?: boolean;
  title: string;
}

function IconButtonGallery({ description, disabled = false, title }: IconButtonGalleryProps) {
  return (
    <StoryCase description={description} title={title}>
      <div style={{ display: 'grid', gap: 32, minWidth: 360 }}>
        {colors.map(color => (
          <section key={color} style={{ display: 'grid', gap: 20 }}>
          <h2 style={{ fontSize: 20, margin: 0 }}>{colorNames[color]}</h2>

          {sizes.map(size => (
            <div key={size} style={{ display: 'grid', gap: 12 }}>
              <h3 style={{ color: '#4b5668', fontSize: 14, margin: 0 }}>{sizeNames[size]}</h3>

              <div
                style={{
                  alignItems: 'start',
                  display: 'grid',
                  gap: 20,
                  gridTemplateColumns: 'repeat(2, minmax(80px, max-content))',
                }}
              >
                {variants.map(variant => (
                  <div key={variant} style={{ display: 'grid', gap: 8 }}>
                    <span style={{ color: '#6c788a', fontSize: 12 }}>{variantNames[variant]}</span>
                    <IconButton
                      aria-label="추가"
                      color={color}
                      disabled={disabled}
                      size={size}
                      variant={variant}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          </section>
        ))}
      </div>
    </StoryCase>
  );
}

const meta = {
  title: '컴포넌트/IconButton',
  component: IconButton,
  args: {
    'aria-label': '추가',
    color: 'brand',
    disabled: false,
    size: 'large',
    type: 'button',
    variant: 'solid',
  },
  argTypes: {
    'aria-label': {
      name: '버튼 설명',
      control: 'text',
      description: '화면에 텍스트가 없는 버튼의 동작을 화면 낭독기가 읽을 수 있게 설명해요.',
    },
    icon: {
      name: '아이콘',
      control: false,
      description: '버튼에 표시할 아이콘이에요. 생략하면 Plus 아이콘을 표시해요.',
    },
    color: {
      name: '색상',
      control: 'inline-radio',
      options: colors,
      description: '버튼의 색상 조합이에요. 조합 선택 기준은 디자이너와 합의 중이에요.',
    },
    size: {
      name: '크기',
      control: 'inline-radio',
      options: sizes,
      description: '버튼의 기본 크기예요. 크기 선택 기준은 디자이너와 합의 중이에요.',
    },
    variant: {
      name: '형태',
      control: 'inline-radio',
      options: variants,
      description: '버튼의 형태예요. 형태 선택 기준은 디자이너와 합의 중이에요.',
    },
    disabled: {
      name: '비활성화',
      control: 'boolean',
      description: '버튼을 비활성 상태로 표시해요.',
    },
    type: {
      name: '버튼 타입',
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'HTML button 요소의 동작 타입이에요.',
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 주요 디자인 조합과 실제 Hover, Pressed 상호작용을 한눈에 확인해요. */
export const Variants: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryOverview description="색상·형태·크기의 사용 기준은 디자이너와 합의 중이며, 이 화면에서는 정의된 디자인 조합만 비교해요.">
      <IconButtonGallery
        description="버튼 위에 마우스를 올리거나 누른 채로 Hover와 Pressed 상태를 확인해요."
        title="기본 상태"
      />
      <IconButtonGallery
        description="전체 디자인 조합의 비활성화 상태예요."
        disabled
        title="비활성화"
      />
    </StoryOverview>
  ),
};

/* 공개 props를 바꿔 버튼 하나를 직접 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
};
