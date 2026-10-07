import type { ButtonHTMLAttributes } from 'react';

/* Props */
export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-checked' | 'children' | 'onChange'> {
  /** 외부에서 제어하는 On/Off 상태예요. */
  checked?: boolean;

  /** 제어하지 않을 때 처음 표시할 On/Off 상태예요. 기본값은 `false`예요. */
  defaultChecked?: boolean;

  /** 상태가 바뀔 때 다음 On/Off 값을 전달해요. */
  onCheckedChange?: (checked: boolean) => void;
}
