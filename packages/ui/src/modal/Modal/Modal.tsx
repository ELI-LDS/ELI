'use client';

import './Modal.css';
import { Button } from '../../button/Button/Button.js';
import { Dim } from '../../dim/Dim/Dim.js';
import { useId, useRef } from 'react';
import type { CSSProperties } from 'react';
import { useModal } from './useModal.js';
import { useModalFocus } from './useModalFocus.js';
import type { ModalProps } from './Modal.types.js';

/**
 * 화면 위에 제목, 안내 문장과 두 개의 선택 버튼을 표시해요.
 *
 * @example 빠른 사용
 * `<Modal title="삭제할까요?" message="삭제한 내용은 복구할 수 없어요." onPositiveAction={remove} />`
 *
 * ### 주요 설정
 * - `open`, `onOpenChange`: 표시 상태를 외부에서 관리해요.
 * - `defaultOpen`: 처음 표시 여부, 기본값은 `true`예요.
 * - `title`: 제목, 기본값은 `제목`
 * - `message`, `subMessage`: 최대 두 개의 안내 문장
 * - `width`, `height`: 콘텐츠 영역의 크기
 *
 * ### 내용과 동작
 * - Dim·Secondary·Positive·Esc로 닫아요. 두 액션의 콜백에서 preventDefault()로 자동 닫기를 취소할 수 있어요.
 * - 키보드 포커스는 내부에서 순환하고 닫으면 이전 요소로 돌아가요. 중첩 Modal은 지원하지 않아요.
 * - `positiveAction`, `secondaryAction`: 버튼 내용, 기본값은 각각 `버튼`
 * - `onPositiveAction`, `onSecondaryAction`: 각 버튼을 눌렀을 때 실행할 함수
 *
 * ### 스타일 변경
 * - `className`: 화면 전체 루트에 적용해요. 내부 대화상자의 배경·크기를 직접 바꾸는 클래스는 아니에요.
 * - `style`: 같은 루트의 인라인 스타일로, 같은 속성의 일반 클래스보다 우선해요.
 * - 대화상자의 크기는 width·height로 정해요. style.width·style.height와는 적용 대상이 달라요.
 */
export function Modal(props: ModalProps) {
  const {
    open,
    defaultOpen = true,
    onOpenChange,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
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
    ...modalProps
  } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const { close, handlePositiveAction, handleSecondaryAction, isOpen } = useModal({ open, defaultOpen, onOpenChange, onSecondaryAction, onPositiveAction });
  useModalFocus(isOpen, rootRef, dialogRef, close);
  const modalClassName = ['eli-modal', className].filter(Boolean).join(' ');

  /* width는 좁은 화면에서 viewport를 넘지 않도록 최대 너비를 함께 제한해요. */
  const contentStyle: CSSProperties = {
    ...(height !== undefined ? { height } : {}),
    ...(width !== undefined ? { maxWidth: '100%', width } : {}),
  };

  if (!isOpen) return null;

  return (
    <div {...modalProps} className={modalClassName} ref={rootRef}>
      <Dim onClick={close} />
      <div
        aria-describedby={ariaDescribedBy ?? (message !== null || subMessage !== null ? descriptionId : undefined)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : (ariaLabelledBy ?? titleId)}
        aria-modal="true"
        className="eli-modal__content"
        ref={dialogRef}
        role="dialog"
        style={contentStyle}
        tabIndex={-1}
      >
        <div className="eli-modal__text">
          <div className="eli-modal__title eli-typo-heading-h4" id={titleId}>{title}</div>
          <div className="eli-modal__descriptions eli-typo-body-medium" id={descriptionId}>
            {message !== null ? (
              <div className="eli-modal__description">{message}</div>
            ) : null}
            {subMessage !== null ? (
              <div className="eli-modal__description">{subMessage}</div>
            ) : null}
          </div>
        </div>
        <div className="eli-modal__actions">
          <Button color="neutral" icon={null} onClick={handleSecondaryAction} variant="solid" width="100%">
            {secondaryAction}
          </Button>
          <Button
            color="brand"
            icon={null}
            onClick={handlePositiveAction}
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
