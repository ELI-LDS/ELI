'use client';

import './Select.css';
import { ArrowDownIcon } from '../../icon/ArrowDownIcon.js';
import { ChevronForwardIcon } from '../../icon/ChevronForwardIcon.js';
import { MenuItem } from '../../menu/MenuItem/MenuItem.js';
import type { SelectProps } from './Select.types.js';
import { useSelect } from './useSelect.js';

/* Select */
export function Select({
  className,
  defaultValue,
  label = '라벨',
  onBlur,
  onKeyDown,
  onValueChange,
  options,
  placeholder = '선택해주세요.',
  value,
  ...props
}: SelectProps) {
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

  /* Class Name */
  const selectClassName = ['eli-select', className].filter(Boolean).join(' ');

  return (
    /* Root */
    <div
      {...props}
      className={selectClassName}
      data-open={isOpen}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {/* Label */}
      <div className="eli-select__label eli-typo-label-medium" id={labelId}>
        {label}
      </div>

      {/* Select */}
      <div className="eli-select__control">
        {/* Trigger */}
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

        {/* Options */}
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
                rightIcon={<ChevronForwardIcon />}
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
