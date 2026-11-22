import { useRef } from 'react';

/** 입력 지우기는 네이티브 입력 이벤트를 통해 기존 onChange·외부 제어 상태와 연결해요. */
export function useTextFieldClear() {
  const inputRef = useRef<HTMLInputElement>(null);
  const clear = () => {
    const input = inputRef.current;
    const view = input?.ownerDocument.defaultView;
    if (!input || !view || input.disabled || input.readOnly) return;
    // React의 변경 감지가 기존 값을 확인할 수 있도록 DOM 원형의 setter를 사용해요.
    const setter = Object.getOwnPropertyDescriptor(view.HTMLInputElement.prototype, 'value')?.set;
    setter?.call(input, '');
    input.dispatchEvent(new view.Event('input', { bubbles: true }));
    input.focus({ preventScroll: true });
  };
  return { clear, inputRef };
}
