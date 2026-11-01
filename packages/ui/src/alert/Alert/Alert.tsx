import './Alert.css';
import { CautionIcon } from '../../icon/CautionIcon.js';
import { CheckIcon } from '../../icon/CheckIcon.js';
import { ErrorIcon } from '../../icon/ErrorIcon.js';
import { InfoIcon } from '../../icon/InfoIcon.js';
import type { AlertProps } from './Alert.types.js';

/* Status별 아이콘 */
const statusIcons = {
  caution: <CautionIcon />,
  error: <ErrorIcon />,
  info: <InfoIcon />,
  success: <CheckIcon />,
} as const;

/**
 * 상태에 맞는 색상과 아이콘으로 알림을 표시해요.
 *
 * @example 빠른 사용
 * `<Alert status="success" title="저장했어요" message="변경 사항을 반영했어요." />`
 *
 * ### 주요 설정
 * - `status`: `info`(기본값), `success`, `caution`, `error`
 *
 * ### 내용과 동작
 * - `title`: 필수 제목
 * - `message`: 선택 본문
 *
 * ### 스타일 변경
 * - `className`: 루트 `div`에 외부 클래스를 전달해요.
 * - `style`: 루트 `div`의 인라인 스타일을 바꿔요.
 */
export function Alert(props: AlertProps) {
  const {
    message,
    title,
    status = 'info',
    className,
    ...alertProps
  } = props;
  const alertClassName = ['eli-alert', className].filter(Boolean).join(' ');

  return (
    <div {...alertProps} className={alertClassName} data-status={status}>
      <span aria-hidden="true" className="eli-alert__icon">
        {statusIcons[status]}
      </span>
      <div className="eli-alert__content">
        <p className="eli-alert__title eli-typo-label-large">{title}</p>
        {message !== undefined && message !== null ? (
          <p className="eli-alert__message eli-typo-body-medium">{message}</p>
        ) : null}
      </div>
    </div>
  );
}
