'use client';

import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useOverlay } from './useOverlay';
import './Overlay.css';

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  label: string;
  className?: string;
  closeOnBackdrop?: boolean;
  children: (close: () => void) => ReactNode;
  id?: string;
}

/** 조작 중인 화면의 포커스 경계를 관리하고 Storybook에서도 같은 배치를 사용해요. */
export function Overlay({ open, onClose, label, className, closeOnBackdrop = false, children, id }: OverlayProps) {
  const { rootRef, panelRef, hostRef, portalTarget, closing, requestClose, onAnimationEnd } = useOverlay(open, onClose);
  const overlay = (
    <div className={`docs-overlay ${className ?? ''}`} data-closing={closing} hidden={!open} onAnimationEnd={onAnimationEnd} ref={rootRef}>
      <div aria-hidden="true" className="docs-overlay__backdrop" onClick={closeOnBackdrop ? requestClose : undefined} />
      <div aria-label={label} aria-modal="true" className="docs-overlay__panel" data-closing={closing} id={id} onAnimationEnd={onAnimationEnd} ref={panelRef} role="dialog" tabIndex={-1}>
        {children(requestClose)}
      </div>
    </div>
  );
  return <><span hidden ref={hostRef} />{portalTarget ? createPortal(overlay, portalTarget) : null}</>;
}
