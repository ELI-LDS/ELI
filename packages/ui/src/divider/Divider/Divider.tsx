import './Divider.css';
import type { DividerProps } from './Divider.types.js';

/**
 * 콘텐츠 사이를 가로선으로 구분해요.
 *
 * @example 빠른 사용
 * `<Divider />`
 *
 * ### 주요 설정
 * - 별도의 설정 없이 부모 너비에 맞춰 표시해요.
 *
 * ### 내용과 동작
 * - 표준 `hr` 속성을 사용할 수 있어요.
 *
 * ### 스타일 변경
 * - `className`: `hr`에 외부 클래스를 전달해요.
 * - `style`: `hr`의 인라인 스타일을 바꿔요.
 */
export function Divider(props: DividerProps) {
  const { className, ...dividerProps } = props;
  const dividerClassName = ['eli-divider', className].filter(Boolean).join(' ');

  return <hr {...dividerProps} className={dividerClassName} />;
}
