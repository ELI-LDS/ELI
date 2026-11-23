'use client';

import './TextField.css';
import { useId } from 'react';
import { useTextFieldClear } from './useTextFieldClear.js';
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
 * - `ref`: 실제 입력 요소를 가리켜 focus() 같은 입력 동작에 사용해요.
 * - `value`, `defaultValue`: 입력 값
 * - `onChange`: 입력 값이 바뀔 때 실행할 함수
 * - `type`: 표준 input 유형, 기본값은 `text`
 * - X 버튼은 입력을 지우고 onChange로 빈 값을 전달한 뒤 입력창에 포커스를 돌려줘요.
 * - disabled·readOnly에서는 지울 수 없어요.
 *
 * ### 스타일 변경
 * - `className`: 바깥 `div`의 너비·배치 등을 바꿔요. 입력 영역의 테두리·배경이나 내부 글자 크기에는 직접 적용되지 않아요.
 * - `style`: 같은 바깥 `div`의 인라인 스타일이에요. 같은 속성의 일반 클래스보다 우선해요.
 */
export function TextField(props: TextFieldProps) {
  const {
    'aria-invalid': ariaInvalid,
    className,
    id,
    readOnly,
    ref: forwardedRef,
    label = '라벨',
    placeholder = '내용을 입력하세요',
    state = 'default',
    style,
    type = 'text',
    ...inputProps
  } = props;
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const { clear, inputRef, setInputRef } = useTextFieldClear(forwardedRef);
  const textFieldClassName = ['eli-text-field', className].filter(Boolean).join(' ');
  const inputClassName = [
    'eli-text-field__input',
    state === 'disabled' ? 'eli-typo-label-medium' : 'eli-typo-body-medium',
  ].join(' ');

  return (
    <div
      className={textFieldClassName}
      data-state={state}
      style={style}
    >
      <label className="eli-text-field__label eli-typo-label-medium" htmlFor={inputId}>{label}</label>
      <span className="eli-text-field__container" onClick={event => { if (event.target === event.currentTarget) inputRef.current?.focus(); }}>
        <input
          {...inputProps}
          aria-invalid={ariaInvalid ?? (state === 'error' || undefined)}
          className={inputClassName}
          id={inputId}
          readOnly={readOnly}
          ref={setInputRef}
          disabled={state === 'disabled'}
          placeholder={placeholder}
          type={type}
        />
        <button
          aria-label="입력 내용 지우기"
          className="eli-text-field__icon"
          disabled={state === 'disabled' || readOnly}
          onClick={clear}
          onMouseDown={event => event.preventDefault()}
          type="button"
        >
          <XIcon />
        </button>
      </span>
    </div>
  );
}
