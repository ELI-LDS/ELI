import './SelectOption.css';
import { ChevronForwardIcon } from '../../icon/ChevronForwardIcon.js';
import type { SelectOptionProps } from './SelectOption.types.js';

/* Select Option */
export function SelectOption({ id, isSelected, label, onClick }: SelectOptionProps) {
  return (
    <button
      aria-selected={isSelected}
      className="eli-select-option"
      id={id}
      onClick={onClick}
      role="option"
      type="button"
    >
      {/* Text */}
      <span className="eli-select-option__text eli-typo-body-medium">{label}</span>

      {/* Right Icon */}
      <span className="eli-select-option__icon">
        <ChevronForwardIcon />
      </span>
    </button>
  );
}
