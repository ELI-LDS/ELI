import type { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';

/* Props */
export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** Modal의 제목이에요. 생략하면 `제목`을 표시해요. */
  title?: ReactNode;

  /** Modal 제목 아래에 표시할 내용이에요. 생략하면 기본 안내 문구를 두 줄로 표시해요. */
  children?: ReactNode;

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

  /** Secondary 버튼을 선택했을 때 실행할 함수예요. */
  onSecondaryAction?: MouseEventHandler<HTMLButtonElement>;
}
