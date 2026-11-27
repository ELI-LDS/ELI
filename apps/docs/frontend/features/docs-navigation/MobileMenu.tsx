'use client';

import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { HeaderAction } from '../../layouts/Header/Header';
import { Button } from '../../shared/ui/button';
import { Overlay } from '../../shared/ui/Overlay/Overlay';
import { DocsNavigation } from './DocsNavigation';
import './MobileMenu.css';
import './MobileMenu.motion.css';

/** 모바일 탐색을 전체 화면에 열고, 실제 페이지 선택 후 닫아요. */
export function MobileMenu({ label, navigation }: { label?: string; navigation?: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <>
    {label ? <Button aria-controls={id} aria-expanded={open} icon={null} onClick={event => { event.currentTarget.focus({ preventScroll: true }); setOpen(true); }}>{label}</Button> : <HeaderAction action="menu" aria-controls={id} aria-expanded={open} onClick={event => { event.currentTarget.focus({ preventScroll: true }); setOpen(true); }} />}
    <Overlay id={id} label="모바일 문서 메뉴" onClose={() => setOpen(false)} open={open} className="docs-mobile-menu-overlay">
      {close => <>
        <div className="docs-mobile-menu__header">
          <a aria-label="ELI 홈" href="/"><img alt="" height={20} src="/assets/eli-wordmark.svg" width={61} /></a>
          <button aria-label="메뉴 닫기" className="docs-overlay__close" data-autofocus onClick={close} type="button"><img alt="" height={24} src="/assets/close.svg" width={24} /></button>
        </div>
        {navigation ? navigation(close) : <DocsNavigation onNavigate={close} variant="mobile" />}
      </>}
    </Overlay>
  </>;
}
