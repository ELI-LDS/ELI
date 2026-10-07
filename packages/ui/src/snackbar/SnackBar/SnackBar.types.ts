import type { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';

/* Props */
export interface SnackBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** SnackBar에 표시할 메시지예요. 생략하면 `메세지를 작성합니다.`를 표시해요. */
  children?: ReactNode;

  /** SnackBar 오른쪽 버튼에 표시할 내용이에요. 생략하면 `액션`을 표시하고, `null`이면 숨겨요. */
  action?: ReactNode;

  /** 오른쪽 버튼의 글자 색상이에요. */
  actionColor?: CSSProperties['color'];

  /** 오른쪽 버튼을 선택했을 때 실행할 함수예요. */
  onAction?: MouseEventHandler<HTMLButtonElement>;
}
