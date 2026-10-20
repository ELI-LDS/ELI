import type { InputHTMLAttributes } from 'react';

/* Props */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 외부에서 제어하는 선택 상태예요. `true`이면 선택되고 `false`이면 해제돼요. `onChange`와 함께 사용해요. */
  checked?: boolean;

  /** 제어하지 않을 때 처음 표시할 선택 상태예요. 기본값은 `false`예요. */
  defaultChecked?: boolean;

  /** 체크박스를 비활성화할지 정해요. `true`이면 선택할 수 없어요. 기본값은 `false`예요. */
  disabled?: boolean;

  /** Checkbox의 바깥 `span`에 전달할 클래스 이름이에요. 실제 `input`에는 적용되지 않아요. */
  className?: string;
}
