import type { ButtonHTMLAttributes } from 'react';

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'dangerouslySetInnerHTML' | 'aria-checked' | 'children' | 'onChange'> {
  /** 외부에서 제어하는 상태예요. `true`이면 On, `false`이면 Off예요. */
  checked?: boolean;

  /** 제어하지 않을 때 처음 표시할 On/Off 상태예요. 기본값은 `false`예요. */
  defaultChecked?: boolean;

  /** 상태가 바뀔 때 다음 On/Off 값을 전달해요. */
  onCheckedChange?: (checked: boolean) => void;

  /** Toggle을 비활성화할지 정해요. `true`이면 상태를 바꿀 수 없어요. 기본값은 `false`예요. */
  disabled?: boolean;

  /** Toggle의 루트 `button`에 전달할 클래스 이름이에요. */
  className?: string;
}
