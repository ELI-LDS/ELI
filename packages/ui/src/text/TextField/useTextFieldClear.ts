import { useCallback, useRef } from 'react';
import type { Ref, RefCallback } from 'react';

/** 입력 지우기는 네이티브 입력 이벤트를 통해 기존 onChange·외부 제어 상태와 연결해요. */
export function useTextFieldClear(forwardedRef: Ref<HTMLInputElement> | undefined) {
  const inputRef = useRef<HTMLInputElement>(null);
  // 외부 참조를 덮어쓰지 않고 React 19의 콜백 참조 정리 함수도 함께 실행해요.
  const setInputRef = useCallback<RefCallback<HTMLInputElement>>(node => {
    inputRef.current = node;
    const cleanup = typeof forwardedRef === 'function' ? forwardedRef(node) : undefined;
    if (forwardedRef && typeof forwardedRef !== 'function') forwardedRef.current = node;
    return () => {
      inputRef.current = null;
      if (typeof cleanup === 'function') cleanup();
      else if (typeof forwardedRef === 'function') forwardedRef(null);
      else if (forwardedRef) forwardedRef.current = null;
    };
  }, [forwardedRef]);

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
  return { clear, inputRef, setInputRef };
}
