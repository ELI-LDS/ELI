'use client';

import './snack-bar/SnackBar.css';
import type { SnackBarProps } from './snack-bar/SnackBar.types';
import { useSnackBar } from './snack-bar/useSnackBar';
import { useSnackBarTimer } from './snack-bar/useSnackBarTimer';

/**
 * 짧은 메시지와 선택 동작을 한 줄 또는 두 줄로 안내해요.
 *
 * @example 빠른 사용
 * `<SnackBar action="닫기" onAction={close}>저장하지 못했어요.</SnackBar>`
 *
 * ### 주요 설정
 * - `action`: 오른쪽 버튼 내용, 기본값은 `액션`, `null`이면 숨겨요.
 * - `actionColor`: 오른쪽 버튼의 글자 색상
 * - `duration`: 자동 닫힘 시간(ms), 기본값은 `5000`, `0`이면 유지해요.
 * - `open`, `defaultOpen`, `onOpenChange`: 제어·비제어 표시 상태
 *
 * ### 내용과 동작
 * - `children`: 메시지, 기본값은 `메시지를 작성합니다.`
 * - `onAction`: 오른쪽 버튼을 눌렀을 때 실행할 함수
 * - 마우스를 올리거나 내부에 포커스가 있거나 창이 비활성화되면 남은 시간을 보존해요.
 * - 액션 클릭 자체는 자동 닫힘을 실행하지 않아요. 필요하면 부모의 open 상태를 변경해요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `div`에 외부 클래스를 전달해요.
 * - `style`: 루트 `div`의 인라인 스타일을 바꿔요.
 */
export function SnackBar(props: SnackBarProps) {
  const {
    action = '액션',
    actionColor,
    children = '메시지를 작성합니다.',
    className,
    duration: requestedDuration = 5000,
    open,
    defaultOpen,
    onOpenChange,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    onAction,
    ...snackBarProps
  } = props;
  const snackBarClassName = ['eli-snackbar', className].filter(Boolean).join(' ');
  const { close, isOpen } = useSnackBar({ open, defaultOpen, onOpenChange });
  const duration = Number.isFinite(requestedDuration) && requestedDuration >= 0 && requestedDuration <= 2_147_483_647
    ? requestedDuration : 5000;
  const { setHovered, setFocused } = useSnackBarTimer({ open: isOpen, duration, onExpire: close });

  if (!isOpen) return null;

  return (
    <div
      {...snackBarProps}
      className={snackBarClassName}
      onMouseEnter={event => { setHovered(true); onMouseEnter?.(event); }}
      onMouseLeave={event => { setHovered(false); onMouseLeave?.(event); }}
      onFocus={event => { setFocused(true); onFocus?.(event); }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        onBlur?.(event);
      }}
    >
      <span className="eli-snackbar__message eli-typo-body-medium">{children}</span>
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
