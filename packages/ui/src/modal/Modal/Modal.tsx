import './Modal.css';
import { Button } from '../../button/Button/Button.js';
import { Dim } from '../../dim/Dim/Dim.js';
import type { CSSProperties } from 'react';
import type { ModalProps } from './Modal.types.js';

/* Modal */
export function Modal({
  title = '제목',
  message = '내용을 작성합니다',
  subMessage = '내용을 작성합니다',
  positiveAction = '버튼',
  secondaryAction = '버튼',
  onPositiveAction,
  onSecondaryAction,
  className,
  height,
  width,
  ...props
}: ModalProps) {
  /* Class Name */
  const modalClassName = ['eli-modal', className].filter(Boolean).join(' ');

  /* Content Style */
  const contentStyle: CSSProperties = {
    ...(height !== undefined ? { height } : {}),
    ...(width !== undefined ? { maxWidth: '100%', width } : {}),
  };

  return (
    /* Root */
    <div {...props} className={modalClassName}>
      {/* Dim */}
      <Dim />

      {/* Content */}
      <div className="eli-modal__content" style={contentStyle}>
        {/* Text */}
        <div className="eli-modal__text">
          <div className="eli-modal__title eli-typo-heading-h4">{title}</div>
          <div className="eli-modal__descriptions eli-typo-body-medium">
            {message !== null ? (
              <div className="eli-modal__description">{message}</div>
            ) : null}
            {subMessage !== null ? (
              <div className="eli-modal__description">{subMessage}</div>
            ) : null}
          </div>
        </div>

        {/* Actions */}
        <div className="eli-modal__actions">
          <Button color="neutral" icon={null} onClick={onSecondaryAction} variant="solid" width="100%">
            {secondaryAction}
          </Button>
          <Button
            color="brand"
            icon={null}
            onClick={onPositiveAction}
            variant="solid"
            width="100%"
          >
            {positiveAction}
          </Button>
        </div>
      </div>
    </div>
  );
}
