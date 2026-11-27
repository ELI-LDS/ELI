import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const selector = 'button, a[href], input, select, textarea, [tabindex]';

/** 배치된 오버레이 바깥의 배경·스크롤을 잠그고 원래 조작 요소로 포커스를 돌려줘요. */
export function useOverlayFocus(
  open: boolean,
  rootRef: RefObject<HTMLDivElement | null>,
  panelRef: RefObject<HTMLDivElement | null>,
  close: () => void,
) {
  const closeRef = useRef(close);
  useEffect(() => { closeRef.current = close; }, [close]);
  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!open || !root || !panel) return;
    const doc = root.ownerDocument;
    const previous = doc.activeElement instanceof HTMLElement ? doc.activeElement : null;
    const locked: Array<{ element: HTMLElement; inert: boolean }> = [];
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
    const saved = [
      { element: doc.body, property: 'overflow' },
      { element: doc.documentElement, property: 'overflow' },
      { element: doc.body, property: 'padding-right' },
    ].map(({ element, property }) => ({ element, property, value: element.style.getPropertyValue(property), priority: element.style.getPropertyPriority(property) }));
    const view = doc.defaultView;
    const scrollbar = view ? Math.max(0, view.innerWidth - doc.documentElement.clientWidth) : 0;
    if (view && scrollbar > 0) doc.body.style.setProperty('padding-right', `${parseFloat(view.getComputedStyle(doc.body).paddingRight) + scrollbar}px`);
    doc.body.style.setProperty('overflow', 'hidden');
    doc.documentElement.style.setProperty('overflow', 'hidden');
    const elements = () => Array.from(panel.querySelectorAll<HTMLElement>(selector)).filter(element =>
      element.tabIndex >= 0 && !element.matches(':disabled') && !element.closest('[inert], [hidden], [aria-hidden="true"]') && element.getClientRects().length > 0,
    );
    const focusFirst = () => (panel.querySelector<HTMLElement>('[data-autofocus]') ?? elements()[0] ?? panel).focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); }
      if (event.key === 'Tab') {
        event.preventDefault();
        const targets = elements();
        const index = targets.indexOf(doc.activeElement as HTMLElement);
        const next = event.shiftKey ? (index <= 0 ? targets.length - 1 : index - 1) : (index + 1) % targets.length;
        (targets[next] ?? panel).focus();
      }
    };
    const focusin = (event: FocusEvent) => {
      if (event.target instanceof Node && !panel.contains(event.target)) focusFirst();
    };
    doc.addEventListener('keydown', keydown);
    doc.addEventListener('focusin', focusin);
    focusFirst();
    return () => {
      doc.removeEventListener('keydown', keydown);
      doc.removeEventListener('focusin', focusin);
      for (const { element, inert } of locked) element.inert = inert;
      for (const { element, property, value, priority } of saved) {
        if (value) element.style.setProperty(property, value, priority);
        else element.style.removeProperty(property);
      }
      if (previous?.isConnected && !previous.closest('[inert]')) previous.focus({ preventScroll: true });
    };
  }, [open, rootRef, panelRef]);
}
