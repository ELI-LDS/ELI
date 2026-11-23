import type { ChangeEventHandler, Ref, InputHTMLAttributes } from 'react';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'dangerouslySetInnerHTML' | 'children' | 'type'> {
  /** 입력이 바뀌면 호출해요. event.currentTarget.value로 새 값을 확인해요. */
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;

  /** 실제 입력 요소에 접근할 참조예요. focus() 같은 입력 동작에 사용해요. */
  ref?: Ref<HTMLInputElement> | undefined;

  /** 같은 선택 묶음에서 Radio를 구분하는 값이에요. */
  value: string;

  /** 외부에서 제어하는 선택 상태예요. `onChange`와 함께 사용해요. */
  checked?: boolean;

  /** 제어하지 않을 때 처음 표시할 선택 상태예요. 기본값은 `false`예요. */
  defaultChecked?: boolean;

  /** 같은 선택 묶음에 속한 Radio가 공유할 이름이에요. */
  name?: string;

  /** Radio의 바깥 `span`에 전달할 클래스 이름이에요. 실제 `input`에는 적용되지 않아요. */
  className?: string;
}
