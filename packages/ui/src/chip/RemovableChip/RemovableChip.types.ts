import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';

export interface RemovableChipProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'dangerouslySetInnerHTML' | 'children' | 'onClick'> {
  /** 칩에 표시할 라벨이에요. 최대 너비를 넘으면 말줄임표로 표시해요. */
  children: ReactNode;

  /** 라벨 영역을 누르면 호출돼요. 생략하면 라벨은 표시용 요소로 렌더링해요. */
  onClick?: MouseEventHandler<HTMLButtonElement>;

  /** X 아이콘을 누르면 호출돼요. 라벨 영역의 클릭 동작은 실행하지 않아요. */
  onRemove: MouseEventHandler<HTMLButtonElement>;

  /** X 아이콘이 무엇을 삭제하는 버튼인지 화면 낭독기가 읽을 수 있게 설명해요. 기본값은 `삭제`예요. @default '삭제' */
  removeLabel?: string;

  /** `true`이면 라벨과 삭제 버튼을 모두 누를 수 없어요. 기본값은 `false`예요. @default false */
  disabled?: boolean;

  /** RemovableChip의 바깥 `span`에 전달할 클래스 이름이에요. */
  className?: string;
}
