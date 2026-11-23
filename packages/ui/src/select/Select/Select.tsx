'use client';

import './Select.css';
import { ArrowDownIcon } from '../../icon/ArrowDownIcon.js';
import { MenuItem } from '../../menu/MenuItem/MenuItem.js';
import type { SelectProps } from './Select.types.js';
import { useSelect } from './useSelect.js';

/**
 * 옵션 목록을 열어 하나의 값을 선택해요.
 *
 * @example 빠른 사용
 * `<Select label="분류" options={[{ value: 'web', label: '웹' }]} onValueChange={setValue} />`
 *
 * ### 주요 설정
 * - `label`: 입력 영역 이름, 기본값은 `라벨`
 * - `placeholder`: 선택 전 안내 문구, 기본값은 `선택해주세요.`
 * - `options`: `{ value, label }` 목록. 옵션에는 아이콘과 단축키 안내를 표시하지 않아요.
 *
 * ### 내용과 동작
 * - `value`: 외부에서 제어하는 선택 값
 * - `defaultValue`: 처음 선택할 값
 * - `onValueChange`: 선택한 `value`를 받는 함수
 *
 * ### 스타일 변경
 * - `className`: 바깥 div의 너비·배치 등을 바꿔요. 내부 선택 버튼·목록의 배경·테두리·글자 크기를 직접 바꾸지는 않아요.
 * - `style`: 같은 바깥 div의 인라인 스타일로, 같은 속성의 일반 클래스보다 우선해요.
 * - 선택 버튼과 목록의 너비는 바깥 영역을 따라가요. 루트 높이를 바꾸는 것으로 선택 버튼의 높이를 지정하지는 않아요.
 */
export function Select(props: SelectProps) {
  const {
    className,
    defaultValue,
    label = '라벨',
    onBlur,
    onKeyDown,
    onValueChange,
    options,
    placeholder = '선택해주세요.',
    value,
    ...selectProps
  } = props;
  /* Select의 상태와 상호작용은 전용 Hook에서 관리해요. */
  const {
    handleBlur,
    handleKeyDown,
    handleOptionClick,
    handleTriggerClick,
    isOpen,
    labelId,
    listboxId,
    menuRef,
    selectedOption,
    selectedValue,
    triggerRef,
    valueId,
  } = useSelect({ defaultValue, onBlur, onKeyDown, onValueChange, options, value });

  const selectClassName = ['eli-select', className].filter(Boolean).join(' ');

  return (
    <div
      {...selectProps}
      className={selectClassName}
      data-open={isOpen}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <div className="eli-select__label eli-typo-label-medium" id={labelId}>
        {label}
      </div>
      <div className="eli-select__control">
        <button
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={`${labelId} ${valueId}`}
          className="eli-select__trigger"
          data-has-value={selectedOption !== undefined}
          onClick={handleTriggerClick}
          ref={triggerRef}
          type="button"
        >
          <span
            className={`eli-select__value eli-typo-body-medium${selectedOption ? '' : ' eli-select__placeholder'}`}
            id={valueId}
          >
            {selectedOption?.label ?? placeholder}
          </span>

          <span className="eli-select__arrow">
            <ArrowDownIcon />
          </span>
        </button>
        {isOpen ? (
          <div
            aria-labelledby={labelId}
            className="eli-select__menu"
            id={listboxId}
            ref={menuRef}
            role="listbox"
          >
            {options.map((option, index) => (
              <MenuItem
                aria-selected={option.value === selectedValue}
                id={`${listboxId}-option-${index}`}
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                role="option"
              >
                {option.label}
              </MenuItem>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
