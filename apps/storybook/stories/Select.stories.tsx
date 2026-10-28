import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from '@/packages/ui/src/select/Select/Select.js';
import type { SelectProps } from '@/packages/ui/src/select/Select/Select.types.js';
import './Select.stories.css';

const options = [
  { label: '옵션 1', value: 'option-1' },
  { label: '옵션 2', value: 'option-2' },
];

function SelectPlayground({ options: initialOptions, ...selectProps }: SelectProps) {
  const [editableOptions, setEditableOptions] = useState(() =>
    initialOptions.map(option => ({ label: String(option.label), value: option.value })),
  );

  const addOption = () => {
    setEditableOptions(currentOptions => {
      let optionNumber = currentOptions.length + 1;
      while (currentOptions.some(option => option.value === `option-${optionNumber}`)) {
        optionNumber += 1;
      }

      return [
        ...currentOptions,
        { label: `옵션 ${optionNumber}`, value: `option-${optionNumber}` },
      ];
    });
  };

  const updateOption = (index: number, label: string) => {
    setEditableOptions(currentOptions =>
      currentOptions.map((option, optionIndex) =>
        optionIndex === index ? { ...option, label } : option,
      ),
    );
  };

  const removeOption = (index: number) => {
    setEditableOptions(currentOptions =>
      currentOptions.filter((_, optionIndex) => optionIndex !== index),
    );
  };

  return (
    <div className="eli-story-select-playground">
      <div className="eli-story-select-playground__preview">
        <strong>미리보기</strong>
        <Select {...selectProps} options={editableOptions} />
      </div>

      <section className="eli-story-select-playground__editor">
        <strong>옵션 편집</strong>
        {editableOptions.map((option, index) => (
          <div className="eli-story-select-playground__option" key={option.value}>
            <label className="eli-story-select-playground__field">
              <span>옵션 {index + 1}</span>
              <input
                aria-label={`옵션 ${index + 1} 텍스트`}
                onChange={event => updateOption(index, event.currentTarget.value)}
                type="text"
                value={option.label}
              />
            </label>
            <button
              disabled={editableOptions.length === 1}
              onClick={() => removeOption(index)}
              type="button"
            >
              삭제
            </button>
          </div>
        ))}
        <button onClick={addOption} type="button">
          옵션 추가
        </button>
      </section>
    </div>
  );
}

const meta = {
  title: '컴포넌트/Select',
  component: Select,
  parameters: { layout: 'centered' },
  args: {
    label: '라벨',
    options,
    placeholder: '선택해주세요.',
  },
  argTypes: {
    label: {
      name: '라벨',
      control: 'text',
      description: '선택 영역 위에 표시할 라벨이에요.',
    },
    placeholder: {
      name: 'Placeholder 문구',
      control: 'text',
      description: '값을 선택하기 전에 표시할 안내 문구예요.',
    },
    options: {
      name: '옵션 목록',
      control: false,
      description: '아래 옵션 편집 영역에서 항목을 하나씩 추가하고 텍스트를 바꿀 수 있어요.',
    },
    defaultValue: {
      table: { disable: true },
    },
    onValueChange: {
      table: { disable: true },
    },
    value: {
      table: { disable: true },
    },
    className: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 선택 전과 선택 완료 상태에서 실제 Hover와 펼침 동작을 확인해요. */
export const Overview: Story = {
  name: '한눈에 보기',
  parameters: { controls: { disable: true } },
  render: args => (
    <div
      style={{
        display: 'grid',
        fontFamily: 'var(--eli-font-family-sans, "Pretendard Variable")',
        gap: 40,
      }}
    >
      <p style={{ color: '#4b5668', margin: 0 }}>
        선택 영역에 마우스를 올리거나 눌러 Hover와 펼침 상태를 확인해요.
      </p>

      <div style={{ display: 'grid', gap: 8 }}>
        <strong>선택 전</strong>
        <Select {...args} />
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <strong>선택 완료</strong>
        <Select {...args} defaultValue="option-1" />
      </div>
    </div>
  ),
};

/* 라벨, Placeholder 문구와 옵션 목록을 바꿔 Select 하나를 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  parameters: { controls: { exclude: ['옵션 목록'] } },
  render: args => <SelectPlayground key={args.options.map(option => option.value).join('-')} {...args} />,
};
