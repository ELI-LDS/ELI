'use client';

import './TextArea.css';
import type { TextAreaProps } from './TextArea.types.js';

/**
 * 여러 줄의 내용을 입력해요.
 *
 * @example 빠른 사용
 * `<TextArea label="소개" placeholder="소개를 입력하세요" />`
 *
 * ### 주요 설정
 * - `label`: 입력 영역 이름, 기본값은 `라벨`
 * - `placeholder`: 값이 없을 때의 안내 문구
 * - `disabled`: `true`이면 비활성화해요.
 *
 * ### 내용과 동작
 * - `value`, `defaultValue`: 입력 값
 * - `onChange`: 입력 값이 바뀔 때 실행할 함수
 *
 * ### 스타일 변경
 * - `className`: 바깥 `label`에 외부 클래스를 전달해요.
 * - `style`: 바깥 `label`의 인라인 스타일을 바꿔요.
 */
export function TextArea(props: TextAreaProps) {
  const {
    className,
    disabled = false,
    label = '라벨',
    placeholder = '내용을 입력하세요',
    style,
    ...textAreaProps
  } = props;
  const textAreaClassName = ['eli-text-area', className].filter(Boolean).join(' ');
  const inputClassName = [
    'eli-text-area__input',
    disabled ? 'eli-typo-label-medium' : 'eli-typo-body-medium',
  ].join(' ');

  return (
    <label className={textAreaClassName} style={style}>
      <span className="eli-text-area__label eli-typo-label-medium">{label}</span>
      <textarea
        {...textAreaProps}
        className={inputClassName}
        disabled={disabled}
        placeholder={placeholder}
      />
    </label>
  );
}
