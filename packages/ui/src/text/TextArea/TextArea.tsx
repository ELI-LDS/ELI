import './TextArea.css';
import type { TextAreaProps } from './TextArea.types.js';

/* Text Area */
export function TextArea({
  className,
  disabled = false,
  label = '라벨',
  placeholder = '내용을 입력하세요',
  style,
  ...props
}: TextAreaProps) {
  /* Class Name */
  const textAreaClassName = ['eli-text-area', className].filter(Boolean).join(' ');
  const inputClassName = [
    'eli-text-area__input',
    disabled ? 'eli-typo-label-medium' : 'eli-typo-body-large',
  ].join(' ');

  return (
    /* Root */
    <label className={textAreaClassName} style={style}>
      {/* Label */}
      <span className="eli-text-area__label eli-typo-label-medium">{label}</span>

      {/* Input */}
      <textarea
        {...props}
        className={inputClassName}
        disabled={disabled}
        placeholder={placeholder}
      />
    </label>
  );
}
