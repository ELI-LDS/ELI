import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  StoryCase,
  StoryOverview,
  StoryPreviewLayout,
} from '../components/StoryDeviceFrame.js';
import { Select } from '@/packages/ui/src/select/Select/Select.js';
import type { SelectProps } from '@/packages/ui/src/select/Select/Select.types.js';
import './Select.stories.css';

const options = [
  { label: '옵션 1', value: 'option-1' },
  { label: '옵션 2', value: 'option-2' },
];

function SelectPlayground({ options: initialOptions, ...selectProps }: SelectProps) {
  const [editableOptions, setEditableOptions] = useState(() =>
    initialOptions.map(option => ({ label: String(option.label), value: option.value, disabled: option.disabled ?? false })),
  );

  const addOption = () => {
    setEditableOptions(currentOptions => {
      let optionNumber = currentOptions.length + 1;
      while (currentOptions.some(option => option.value === `option-${optionNumber}`)) {
        optionNumber += 1;
      }

      return [
        ...currentOptions,
        { label: `옵션 ${optionNumber}`, value: `option-${optionNumber}`, disabled: false },
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
    <StoryPreviewLayout
      editor={(
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
            <label>
              <input
                aria-label={`옵션 ${index + 1} 비활성화`}
                checked={option.disabled}
                onChange={event => {
                  const disabled = event.currentTarget.checked;
                  setEditableOptions(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, disabled } : item));
                }}
                type="checkbox"
              />
              비활성화
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
      )}
      label="Select 직접 바꿔보기"
    >
      <Select {...selectProps} options={editableOptions} />
    </StoryPreviewLayout>
  );
}

const meta = {
  title: '컴포넌트/Select',
  component: Select,
  args: {
    disabled: false,
    label: '라벨',
    options,
    placeholder: '선택해주세요.',
  },
  argTypes: {
    disabled: { name: '비활성화', control: 'boolean', description: 'true이면 값을 바꿀 수 없어요.' },
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
    <StoryOverview description="선택 영역에 마우스를 올리거나 눌러 Hover와 펼침 상태를 확인해요. Select의 옵션에는 좌우 아이콘과 단축키 안내를 표시하지 않아요.">
      <StoryCase title="선택 전">
        <Select {...args} />
      </StoryCase>
      <StoryCase title="전체 비활성화">
        <Select {...args} disabled />
      </StoryCase>
      <StoryCase title="선택 완료">
        <Select {...args} defaultValue="option-1" />
      </StoryCase>
    </StoryOverview>
  ),
};

/* 라벨, Placeholder 문구와 옵션 목록을 바꿔 Select 하나를 확인해요. */
export const Playground: Story = {
  name: '직접 바꿔보기',
  parameters: {
    controls: { exclude: ['옵션 목록'] },
  },
  render: args => <SelectPlayground key={args.options.map(option => option.value).join('-')} {...args} />,
};
