import type { InputHTMLAttributes } from 'react';

/* Props */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 외부에서 제어하는 선택 상태예요. `onChange`와 함께 사용해요. */
  checked?: boolean;

  /** 제어하지 않을 때 처음 표시할 선택 상태예요. */
  defaultChecked?: boolean;
}
