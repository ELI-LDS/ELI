import './LoadingIndicator.css';
import type { LoadingIndicatorProps } from './LoadingIndicator.types.js';

/**
 * 화면 전체나 영역이 처리 중임을 원형으로 표시해요.
 *
 * @example 빠른 사용
 * `<LoadingIndicator aria-label="파일 업로드" progress={50} />`
 *
 * @example 진행률을 모르는 경우
 * `<LoadingIndicator aria-label="데이터 불러오는 중" />`
 *
 * ### 주요 설정
 * - `progress`: `0`, `10`, `30`, `50`, `80`, `100`; 생략하면 반복 애니메이션
 * - `variant`: `continuous`(기본) | `cycle`; 진행률을 모를 때의 회전 방식
 *
 * ### 선택 가이드
 * - 완료 비율을 알면 `progress`를 전달해 실제 진행 상태를 보여줘요.
 * - 완료 비율을 알 수 없으면 `progress`를 생략해 작업 중임을 보여줘요.
 * - 끊김 없이 일정하게 회전하려면 `continuous`, Figma의 2초 가감속 모션을 사용하려면 `cycle`을 선택해요.
 *
 * ### 내용과 동작
 * - `aria-label`: 어떤 작업이 진행 중인지 설명해요.
 * - 애니메이션은 사용자의 모션 줄이기 설정을 따라요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `div`에 외부 클래스를 전달해요.
 * - `style`: 루트 `div`의 인라인 스타일을 바꿔요.
 */
export function LoadingIndicator(props: LoadingIndicatorProps) {
  const {
    'aria-label': ariaLabel,
    className,
    progress,
    variant = 'continuous',
    ...indicatorProps
  } = props;
  const isDeterminate = progress !== undefined;
  const indicatorClassName = ['eli-loading-indicator', className].filter(Boolean).join(' ');

  return (
    <div
      {...indicatorProps}
      aria-label={ariaLabel}
      aria-valuemax={isDeterminate ? 100 : undefined}
      aria-valuemin={isDeterminate ? 0 : undefined}
      aria-valuenow={progress}
      aria-valuetext={isDeterminate ? undefined : '진행 중'}
      className={indicatorClassName}
      data-progress={progress}
      data-state={isDeterminate ? 'determinate' : 'indeterminate'}
      data-variant={variant}
      role="progressbar"
    >
      {isDeterminate ? (
        <svg
          aria-hidden="true"
          className="eli-loading-indicator__determinate"
          viewBox="0 0 40 40"
        >
          <circle
            className="eli-loading-indicator__determinate-track"
            cx="20"
            cy="20"
            pathLength="100"
            r="17"
          />
          <circle
            className="eli-loading-indicator__determinate-active"
            cx="20"
            cy="20"
            pathLength="100"
            r="17"
            style={{ strokeDashoffset: 100 - progress }}
          />
        </svg>
      ) : (
        <>
          <span aria-hidden="true" className="eli-loading-indicator__track" />
          <span aria-hidden="true" className="eli-loading-indicator__active" />
        </>
      )}
    </div>
  );
}
