import './TextField.css';
import { XIcon } from '../../icon/XIcon.js';
import type { TextFieldProps } from './TextField.types.js';

/* Text Field */
export function TextField({
  'aria-invalid': ariaInvalid,
  className,
  label = '라벨',
  placeholder = '내용을 입력하세요',
  state = 'default',
  style,
  type = 'text',
  ...props
}: TextFieldProps) {
  /* Class Name */
  const textFieldClassName = ['eli-text-field', className].filter(Boolean).join(' ');
  const inputClassName = [
    'eli-text-field__input',
    state === 'disabled' ? 'eli-typo-label-medium' : 'eli-typo-body-large',
  ].join(' ');

  return (
    /* Root */
    <label
      className={textFieldClassName}
      data-state={state}
      style={style}
    >
      {/* Label */}
      <span className="eli-text-field__label eli-typo-label-medium">{label}</span>

      {/* Input Container */}
      <span className="eli-text-field__container">
        {/* Input */}
        <input
          {...props}
          aria-invalid={ariaInvalid ?? (state === 'error' || undefined)}
          className={inputClassName}
          disabled={state === 'disabled'}
          placeholder={placeholder}
          type={type}
        />

        {/* Right Icon */}
        <span className="eli-text-field__icon">
          <XIcon />
        </span>
      </span>
    </label>
  );
}
