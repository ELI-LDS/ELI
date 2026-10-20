'use client';

import './SnackBar.css';
import type { SnackBarProps } from './SnackBar.types.js';

/**
 * 짧은 메시지와 선택 동작을 한 줄 또는 두 줄로 안내해요.
 *
 * @example 빠른 사용
 * `<SnackBar action="닫기" onAction={close}>저장하지 못했어요.</SnackBar>`
 *
 * ### 주요 설정
 * - `action`: 오른쪽 버튼 내용, 기본값은 `액션`, `null`이면 숨겨요.
 * - `actionColor`: 오른쪽 버튼의 글자 색상
 *
 * ### 내용과 동작
 * - `children`: 메시지, 기본값은 `메세지를 작성합니다.`
 * - `onAction`: 오른쪽 버튼을 눌렀을 때 실행할 함수
 *
 * ### 스타일 변경
 * - `className`: 루트 `div`에 외부 클래스를 전달해요.
 * - `style`: 루트 `div`의 인라인 스타일을 바꿔요.
 */
export function SnackBar(props: SnackBarProps) {
  const {
    action = '액션',
    actionColor,
    children = '메세지를 작성합니다.',
    className,
    onAction,
    ...snackBarProps
    } = props;
  /* Class Name */
  const snackBarClassName = ['eli-snackbar', className].filter(Boolean).join(' ');

  return (
    /* Root */
    <div {...snackBarProps} className={snackBarClassName}>
      {/* Message */}
      <span className="eli-snackbar__message eli-typo-body-medium">{children}</span>

      {/* Action */}
      {action !== undefined && action !== null ? (
        <button
          className="eli-snackbar__action eli-typo-label-large"
          onClick={onAction}
          style={actionColor !== undefined ? { color: actionColor } : undefined}
          type="button"
        >
          {action}
        </button>
      ) : null}
    </div>
  );
}
