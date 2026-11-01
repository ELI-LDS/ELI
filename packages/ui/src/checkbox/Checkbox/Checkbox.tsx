'use client';

import './Checkbox.css';
import { CheckIcon } from '../../icon/CheckIcon.js';
import type { CheckboxProps } from './Checkbox.types.js';

/**
 * 하나의 항목을 선택하거나 해제해요.
 *
 * @example 빠른 사용
 * `<Checkbox aria-label="약관 동의" defaultChecked />`
 *
 * ### 주요 설정
 * - `checked`: 외부에서 제어하는 선택 상태
 * - `defaultChecked`: 처음 선택 상태, 기본값은 `false`
 * - `disabled`: `true`이면 비활성화해요.
 *
 * ### 내용과 동작
 * - `aria-label`: 화면에 라벨이 없다면 동작을 설명해요.
 * - `onChange`: 선택 상태가 바뀔 때 실행할 함수
 *
 * ### 스타일 변경
 * - `className`: 바깥 `span`에 외부 클래스를 전달해요.
 * - `style`: 바깥 `span`의 인라인 스타일을 바꿔요.
 */
export function Checkbox(props: CheckboxProps) {
  const { className, style, ...inputProps } = props;
  const checkboxClassName = ['eli-checkbox', className].filter(Boolean).join(' ');

  return (
    <span className={checkboxClassName} style={style}>
      <input {...inputProps} className="eli-checkbox__input" type="checkbox" />
      <span aria-hidden="true" className="eli-checkbox__icon">
        <CheckIcon />
      </span>
    </span>
  );
}
