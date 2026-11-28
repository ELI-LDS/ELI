import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const focusableSelector = 'button, input, select, textarea, a[href], [tabindex], [contenteditable="true"]';

/** 숨김·비활성 요소를 제외해 실제 키보드 순서만 순환해요. */
function focusableElements(dialog: HTMLElement) {
  return Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(element =>
    element.tabIndex >= 0 && !element.matches(':disabled') &&
    !element.closest('[inert], [hidden]') && element.getClientRects().length > 0 &&
    element.ownerDocument.defaultView?.getComputedStyle(element).visibility !== 'hidden',
  );
}

/** 열린 동안의 포커스·배경 잠금을 소유하고 닫기·unmount에서 원상 복구해요. 중첩 Modal은 지원하지 않아요. */
export function useModalFocus(
  isOpen: boolean,
  rootRef: RefObject<HTMLDivElement | null>,
  dialogRef: RefObject<HTMLDivElement | null>,
  close: () => void,
) {
  const closeRef = useRef(close);
  // 콜백만 바뀌었을 때 잠금을 다시 만들거나 포커스를 초기화하지 않아요.
  useEffect(() => { closeRef.current = close; }, [close]);

  useEffect(() => {
    const root = rootRef.current;
    const dialog = dialogRef.current;
    if (!isOpen || !root || !dialog) return;
    const doc = root.ownerDocument;
    const view = doc.defaultView;
    if (!view) return;
    const previousFocus = doc.activeElement instanceof HTMLElement ? doc.activeElement : null;
    const locked: Array<{ element: HTMLElement; inert: boolean }> = [];
    // 포털 없이 조상 경로의 형제만 잠가 Storybook 프레임 배치도 유지해요.
    let branch: HTMLElement = root;
    while (branch.parentElement) {
      const parent = branch.parentElement;
      for (const sibling of Array.from(parent.children)) {
        if (sibling !== branch && sibling instanceof HTMLElement) {
          locked.push({ element: sibling, inert: sibling.inert });
          sibling.inert = true;
        }
      }
      if (parent === doc.body) break;
      branch = parent;
    }
    const savedStyles = [
      { element: doc.body, property: 'overflow' },
      { element: doc.documentElement, property: 'overflow' },
      { element: doc.body, property: 'padding-right' },
    ].map(({ element, property }) => ({ element, property, value: element.style.getPropertyValue(property), priority: element.style.getPropertyPriority(property) }));
    const scrollbar = Math.max(0, view.innerWidth - doc.documentElement.clientWidth);
    if (scrollbar > 0) {
      doc.body.style.setProperty('padding-right', `${parseFloat(view.getComputedStyle(doc.body).paddingRight) + scrollbar}px`);
    }
    doc.body.style.setProperty('overflow', 'hidden');
    doc.documentElement.style.setProperty('overflow', 'hidden');

    const focusFirst = () => (focusableElements(dialog)[0] ?? dialog).focus({ preventScroll: true });
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !dialog.contains(event.target)) focusFirst();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
      } else if (event.key === 'Tab') {
        // Safari의 키보드 설정과 관계없이 dialog 안의 모든 조작 요소를 순환해요.
        event.preventDefault();
        const elements = focusableElements(dialog);
        const index = elements.indexOf(doc.activeElement as HTMLElement);
        if (elements.length === 0) dialog.focus();
        else {
          const next = event.shiftKey
            ? (index <= 0 ? elements.length - 1 : index - 1)
            : (index + 1) % elements.length;
          elements[next]?.focus();
        }
      }
    };
    doc.addEventListener('keydown', onKeyDown);
    doc.addEventListener('focusin', onFocus);
    // 첫 버튼은 Secondary이므로 열자마자 파괴적인 Positive 액션에 포커스되지 않아요.
    focusFirst();
    return () => {
      doc.removeEventListener('keydown', onKeyDown);
      doc.removeEventListener('focusin', onFocus);
      for (const { element, inert } of locked) element.inert = inert;
      for (const { element, property, value, priority } of savedStyles) {
        if (value) element.style.setProperty(property, value, priority);
        else element.style.removeProperty(property);
      }
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen, rootRef, dialogRef]);
}
