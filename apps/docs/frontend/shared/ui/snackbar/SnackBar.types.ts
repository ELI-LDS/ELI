import type { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';

export interface SnackBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML' | 'children'> {
  /** 자동으로 닫히기까지의 밀리초예요. 기본값은 5000이며 0이면 자동으로 닫히지 않아요. 유효하지 않거나 브라우저 타이머 한도를 넘는 값은 기본값으로 처리해요. */
  duration?: number;

  /** 외부에서 표시 상태를 제어해요. onOpenChange에서 다음 상태를 반영해요. */
  open?: boolean;

  /** 비제어 방식의 처음 표시 여부예요. 기본값은 true예요. */
  defaultOpen?: boolean;

  /** 시간이 지나 닫힐 때 false를 전달해요. 다시 표시는 부모에서 open을 true로 변경해요. */
  onOpenChange?: (open: boolean) => void;

  /** SnackBar에 표시할 메시지예요. 생략하면 `메시지를 작성합니다.`를 표시해요. */
  children?: ReactNode;

  /** SnackBar 오른쪽 버튼에 표시할 내용이에요. 생략하면 `액션`을 표시하고, `null`이면 숨겨요. */
  action?: ReactNode;

  /** 오른쪽 버튼의 글자 색상이에요. */
  actionColor?: CSSProperties['color'];

  /** 오른쪽 버튼을 선택했을 때 실행할 함수예요. */
  onAction?: MouseEventHandler<HTMLButtonElement>;

  /** SnackBar의 루트 `div`에 전달할 클래스 이름이에요. */
  className?: string;
}
