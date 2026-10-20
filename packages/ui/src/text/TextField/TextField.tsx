import './TextField.css';
import { XIcon } from '../../icon/XIcon.js';
import type { TextFieldProps } from './TextField.types.js';

/**
 * 한 줄의 내용을 입력하고 결과 상태를 표시해요.
 *
 * @example 빠른 사용
 * `<TextField label="이메일" placeholder="이메일을 입력하세요" />`
 *
 * ### 주요 설정
 * - `label`: 입력창 이름, 기본값은 `라벨`
 * - `placeholder`: 값이 없을 때의 안내 문구
 * - `state`: `default`(기본값), `error`, `success`, `disabled`
 *
 * ### 내용과 동작
 * - `value`, `defaultValue`: 입력 값
 * - `onChange`: 입력 값이 바뀔 때 실행할 함수
 * - `type`: 표준 input 유형, 기본값은 `text`
 *
 * ### 스타일 변경
 * - `className`: 바깥 `label`에 외부 클래스를 전달해요.
 * - `style`: 바깥 `label`의 인라인 스타일을 바꿔요.
 */
export function TextField(props: TextFieldProps) {
  const {
    'aria-invalid': ariaInvalid,
    className,
    label = '라벨',
    placeholder = '내용을 입력하세요',
    state = 'default',
    style,
    type = 'text',
    ...inputProps
    } = props;
  /* Class Name */
  const textFieldClassName = ['eli-text-field', className].filter(Boolean).join(' ');
  const inputClassName = [
    'eli-text-field__input',
    state === 'disabled' ? 'eli-typo-label-medium' : 'eli-typo-body-medium',
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
          {...inputProps}
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
