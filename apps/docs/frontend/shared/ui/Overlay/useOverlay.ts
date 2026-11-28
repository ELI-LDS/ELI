import { useEffect, useRef, useState } from 'react';
import type { AnimationEvent } from 'react';
import { useOverlayFocus } from './useOverlayFocus';

/** 종료 모션이 끝날 때까지 콘텐츠와 배경 잠금을 유지해 갑자기 사라지지 않게 해요. */
export function useOverlay(open: boolean, onClose: () => void) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  // 조상 요소의 blur·container 경계에 갇히지 않도록 열 때만 배치할 DOM을 결정해요.
  useEffect(() => {
    if (open) setPortalTarget(hostRef.current?.closest('[data-docs-overlay-host]') ?? document.body);
  }, [open]);
  const [closing, setClosing] = useState(false);
  const finish = () => { setClosing(false); onClose(); };
  const requestClose = () => {
    const panel = panelRef.current;
    const root = rootRef.current;
    if (panel && root && (getComputedStyle(panel).animationName !== 'none' || getComputedStyle(root).animationName !== 'none')) setClosing(true);
    else finish();
  };
  useOverlayFocus(open && portalTarget !== null, rootRef, panelRef, requestClose);
  const onAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closing) finish();
  };
  return { rootRef, panelRef, hostRef, portalTarget, closing, requestClose, onAnimationEnd };
}
