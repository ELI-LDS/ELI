import type { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** 표시 여부를 외부에서 관리해요. onOpenChange에서 새 값을 반영해요. */
  open?: boolean;

  /** 외부 제어를 하지 않을 때 처음 표시할지 정해요. 기본값은 true예요. */
  defaultOpen?: boolean;

  /** Dim·Secondary·Esc로 닫기를 요청하면 false를 받아요. Positive는 자동으로 닫지 않아요. */
  onOpenChange?: (open: boolean) => void;

  /** Modal의 제목이에요. 생략하면 `제목`을 표시해요. */
  title?: ReactNode;

  /** Modal 제목 아래 첫 번째 문장이에요. 생략하면 `내용을 작성합니다`를 표시해요. */
  message?: ReactNode;

  /** Modal 제목 아래 두 번째 문장이에요. 생략하면 `내용을 작성합니다`를 표시하고, `null`이면 숨겨요. */
  subMessage?: ReactNode;

  /** Modal 콘텐츠의 가로 크기예요. 숫자는 px로 처리하며 `100%` 같은 CSS 값도 사용할 수 있어요. */
  width?: CSSProperties['width'];

  /** Modal 콘텐츠의 세로 크기예요. 숫자는 px로 처리해요. */
  height?: CSSProperties['height'];

  /** 오른쪽 Positive 버튼에 표시할 내용이에요. 생략하면 `버튼`을 표시해요. */
  positiveAction?: ReactNode;

  /** 왼쪽 Secondary 버튼에 표시할 내용이에요. 생략하면 `버튼`을 표시해요. */
  secondaryAction?: ReactNode;

  /** Positive 버튼을 선택했을 때 실행할 함수예요. */
  onPositiveAction?: MouseEventHandler<HTMLButtonElement>;

  /** Secondary 버튼을 누르면 실행한 뒤 닫아요. event.preventDefault()로 자동 닫기를 취소해요. */
  onSecondaryAction?: MouseEventHandler<HTMLButtonElement>;

  /** 화면 전체를 덮는 Modal 루트에 전달할 클래스 이름이에요. 내부 콘텐츠에는 적용되지 않아요. */
  className?: string;
}
