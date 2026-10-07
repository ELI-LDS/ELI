import './Modal.css';
import { Button } from '../../button/Button/Button.js';
import { Dim } from '../../dim/Dim/Dim.js';
import type { CSSProperties } from 'react';
import type { ModalProps } from './Modal.types.js';

// TODO: 텍스트 영역의 최종 두 줄 문구가 확정되면 현재 기본값을 교체해요.
const defaultDescription = (
  <>
    내용을 작성합니다
    <br />
    내용을 작성합니다
  </>
);

/* Modal */
export function Modal({
  children = defaultDescription,
  className,
  height,
  onPositiveAction,
  onSecondaryAction,
  positiveAction = '버튼',
  secondaryAction = '버튼',
  title = '제목',
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
          <div className="eli-modal__description eli-typo-body-medium">{children}</div>
        </div>

        {/* Actions */}
        <div className="eli-modal__actions">
          <Button color="tertiary" icon={null} onClick={onSecondaryAction} variant="solid" width="100%">
            {secondaryAction}
          </Button>
          <Button
            color="primary"
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
