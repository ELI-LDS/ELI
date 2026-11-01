import './Tooltip.css';
import type { TooltipProps } from './Tooltip.types.js';

/**
 * 화면의 요소를 이해하는 데 필요한 짧은 설명을 표시해요.
 *
 * @example 빠른 사용
 * `<Tooltip>버튼을 누르면 파일을 저장해요.</Tooltip>`
 *
 * ### 주요 설정
 * - 최대 너비는 `200px`이며 내용이 길면 여러 줄로 표시해요.
 * - 표시 위치와 열고 닫는 동작은 Tooltip을 사용하는 화면에서 연결해요.
 *
 * ### 내용과 동작
 * - `children`: 툴팁에 표시할 설명
 * - 루트 요소에는 `role="tooltip"`이 적용돼요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `div`에 외부 클래스를 전달해요.
 * - `style`: 루트 `div`의 인라인 스타일을 바꿔요.
 */
export function Tooltip(props: TooltipProps) {
  const { children, className, ...tooltipProps } = props;
  const tooltipClassName = ['eli-tooltip', className].filter(Boolean).join(' ');

  return (
    <div {...tooltipProps} className={tooltipClassName} role="tooltip">
      <span className="eli-tooltip__content eli-typo-label-small">{children}</span>
    </div>
  );
}
