import { useEffect, useState } from 'react';
import type { DocHeading } from './types';

/** 본문과 동일한 ID를 사용하고 한 프레임에 한 번만 현재 구역을 계산해요. */
export function useDocToc(items: readonly DocHeading[]) {
  const [active, setActive] = useState(items[0]?.id ?? '');
  useEffect(() => {
    const ids = items.flatMap(item => [item.id, ...(item.children?.map(child => child.id) ?? [])]);
    const headings = ids.flatMap(id => { const element = document.getElementById(id); return element ? [{ id, element }] : []; });
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = headings[0]?.id ?? '';
      for (const heading of headings) {
        if (heading.element.getBoundingClientRect().top <= 112) current = heading.id;
        else break;
      }
      // 마지막 구역이 짧아 헤더까지 올라오지 못해도 페이지 끝에서는 해당 구역을 표시해요.
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = headings.at(-1)?.id ?? current;
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    // 코드와 설명을 펼쳐 본문 높이가 달라진 경우에도 현재 구역을 다시 계산해요.
    const observer = new ResizeObserver(schedule);
    const content = document.getElementById('docs-main');
    if (content) observer.observe(content);
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); window.removeEventListener('hashchange', schedule); observer.disconnect(); if (frame) cancelAnimationFrame(frame); };
  }, [items]);
  return active;
}
