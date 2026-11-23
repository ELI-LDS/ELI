'use client';

import './Radio.css';
import type { RadioProps } from './Radio.types.js';

/**
 * 여러 선택지 중 하나만 고를 때 사용하는 Radio예요.
 *
 * @example 빠른 사용
 * ```tsx
 * <label><Radio name="course" value="frontend" /> 프론트엔드</label>
 * <label><Radio name="course" value="backend" /> 백엔드</label>
 * ```
 *
 * ### 주요 설정
 * - `name`: 같은 선택 묶음에서 공유하는 이름
 * - `value`: 선택됐을 때 폼에 전달할 값
 * - `checked`: 외부에서 제어하는 선택 상태
 * - `defaultChecked`: 처음 선택 상태, 기본값은 `false`
 *
 * ### 선택 가이드
 * - 여러 항목을 동시에 고를 수 있으면 Checkbox를 사용해요.
 * - 여러 항목 중 하나만 골라야 하면 같은 `name`을 가진 Radio를 사용해요.
 *
 * ### 내용과 동작
 * - `ref`: 실제 입력 요소를 가리켜 focus() 같은 입력 동작에 사용해요.
 * - `onChange`: 선택 상태가 바뀔 때 실행할 함수
 * - 화면에 라벨이 없다면 `aria-label`로 선택지를 설명해요.
 *
 * ### 스타일 변경
 * - `className`: 바깥 `span`에 외부 클래스를 전달해요.
 * - `style`: 바깥 `span`의 인라인 스타일을 바꿔요.
 */
export function Radio(props: RadioProps) {
  const { className, style, ...inputProps } = props;
  const radioClassName = ['eli-radio', className].filter(Boolean).join(' ');

  return (
    <span className={radioClassName} style={style}>
      <input {...inputProps} className="eli-radio__input" type="radio" />
      <span aria-hidden="true" className="eli-radio__indicator" />
    </span>
  );
}
