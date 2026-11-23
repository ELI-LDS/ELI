import type { ButtonHTMLAttributes } from 'react';

export interface TabProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'dangerouslySetInnerHTML' | 'aria-selected' | 'children'> {
  /** Tab에 표시할 한 줄 이름이에요. 기본값은 `탭 이름`이에요. */
  label?: string;

  /** 외부에서 제어하는 선택 상태예요. `true`이면 선택되고 `false`이면 해제돼요. */
  active?: boolean;

  /** 제어하지 않을 때 처음 표시할 선택 상태예요. 기본값은 `true`예요. */
  defaultActive?: boolean;

  /** Tab을 누르면 다음 선택 상태를 전달해요. */
  onActiveChange?: (active: boolean) => void;

  /** Tab의 루트 `button`에 전달할 클래스 이름이에요. */
  className?: string;
}
