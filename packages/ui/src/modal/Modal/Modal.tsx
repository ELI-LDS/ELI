'use client';

import './Modal.css';
import { Button } from '../../button/Button/Button.js';
import { Dim } from '../../dim/Dim/Dim.js';
import type { CSSProperties } from 'react';
import type { ModalProps } from './Modal.types.js';

/**
 * 화면 위에 제목, 안내 문장과 두 개의 선택 버튼을 표시해요.
 *
 * @example 빠른 사용
 * `<Modal title="삭제할까요?" message="삭제한 내용은 복구할 수 없어요." onPositiveAction={remove} />`
 *
 * ### 주요 설정
 * - `title`: 제목, 기본값은 `제목`
 * - `message`, `subMessage`: 최대 두 개의 안내 문장
 * - `width`, `height`: 콘텐츠 영역의 크기
 *
 * ### 내용과 동작
 * - `positiveAction`, `secondaryAction`: 버튼 내용, 기본값은 각각 `버튼`
 * - `onPositiveAction`, `onSecondaryAction`: 각 버튼을 눌렀을 때 실행할 함수
 *
 * ### 스타일 변경
 * - `className`: 화면 전체를 덮는 루트에 외부 클래스를 전달해요.
 * - `style`: 화면 전체를 덮는 루트의 인라인 스타일을 바꿔요.
 */
export function Modal(props: ModalProps) {
  const {
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
  const modalClassName = ['eli-modal', className].filter(Boolean).join(' ');

  /* width는 좁은 화면에서 viewport를 넘지 않도록 최대 너비를 함께 제한해요. */
  const contentStyle: CSSProperties = {
    ...(height !== undefined ? { height } : {}),
    ...(width !== undefined ? { maxWidth: '100%', width } : {}),
  };

  return (
    <div {...modalProps} className={modalClassName}>
      <Dim />
      <div className="eli-modal__content" style={contentStyle}>
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
