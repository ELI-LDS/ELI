import type { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML' | 'children' | 'title'> {
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

  /** 내부 대화상자의 가로 크기예요. 숫자(px)나 CSS 값을 사용하고 일반 CSS 기본 너비보다 우선해요. 부모의 가용 너비를 넘지 않도록 제한하며 화면 전체 루트의 style.width와는 적용 대상이 달라요. */
  width?: CSSProperties['width'];

  /** 내부 대화상자의 세로 크기예요. 숫자(px)나 CSS 값을 사용하고 일반 CSS 기본 높이보다 우선해요. 화면 전체 루트의 style.height와는 적용 대상이 달라요. */
  height?: CSSProperties['height'];

  /** 오른쪽 Positive 버튼에 표시할 내용이에요. 생략하면 `버튼`을 표시해요. */
  positiveAction?: ReactNode;

  /** 왼쪽 Secondary 버튼에 표시할 내용이에요. 생략하면 `버튼`을 표시해요. */
  secondaryAction?: ReactNode;

  /** Positive 버튼을 선택했을 때 실행할 함수예요. */
  onPositiveAction?: MouseEventHandler<HTMLButtonElement>;

  /** Secondary 버튼을 누르면 실행한 뒤 닫아요. event.preventDefault()로 자동 닫기를 취소해요. */
  onSecondaryAction?: MouseEventHandler<HTMLButtonElement>;

  /** 화면 전체 루트에 적용해요. 내부 대화상자의 배경·크기를 직접 바꾸지는 않아요. 대화상자 크기는 width·height를 사용하고, 루트의 같은 속성을 style에도 지정하면 인라인 지정이 일반 클래스보다 우선해요. */
  className?: string;
}
