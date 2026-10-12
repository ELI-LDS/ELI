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

/* Alert */
export function Alert({
  /* Content */
  message,
  title,

  /* Style Options */
  status = 'info',

  /* Native Element */
  className,
  ...props
}: AlertProps) {
  /* Class Name */
  const alertClassName = ['eli-alert', className].filter(Boolean).join(' ');

  return (
    /* Root */
    <div {...props} className={alertClassName} data-status={status}>
      {/* Status Icon */}
      <span aria-hidden="true" className="eli-alert__icon">
        {statusIcons[status]}
      </span>

      {/* Text */}
      <div className="eli-alert__content">
        <p className="eli-alert__title eli-typo-label-large">{title}</p>
        {message !== undefined && message !== null ? (
          <p className="eli-alert__message eli-typo-body-medium">{message}</p>
        ) : null}
      </div>
    </div>
  );
}
