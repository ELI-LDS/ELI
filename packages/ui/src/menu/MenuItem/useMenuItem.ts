import { useState } from 'react';
import type { PointerEventHandler } from 'react';
import type { MenuItemProps } from './MenuItem.types.js';

type MenuItemInteraction = 'down' | 'up';

/* Pointer 상호작용에 필요한 공개 이벤트만 받아요. */
interface UseMenuItemOptions {
  onPointerCancel: MenuItemProps['onPointerCancel'];
  onPointerDown: MenuItemProps['onPointerDown'];
  onPointerLeave: MenuItemProps['onPointerLeave'];
  onPointerUp: MenuItemProps['onPointerUp'];
}

/* Mouse Down과 Mouse Up 애니메이션 상태를 관리해요. */
export function useMenuItem({
  onPointerCancel,
  onPointerDown,
  onPointerLeave,
  onPointerUp,
}: UseMenuItemOptions) {
  const [interaction, setInteraction] = useState<MenuItemInteraction>();

  /* 마우스·터치·펜으로 누르기 시작하면 Down 애니메이션을 실행해요. */
  const handlePointerDown: PointerEventHandler<HTMLButtonElement> = event => {
    onPointerDown?.(event);
    if (!event.defaultPrevented) setInteraction('down');
  };

  /* 누르기를 마치면 Up 애니메이션으로 원래 크기를 복원해요. */
  const handlePointerUp: PointerEventHandler<HTMLButtonElement> = event => {
    onPointerUp?.(event);
    if (!event.defaultPrevented) setInteraction('up');
  };

  /* 누르기가 취소되면 Down 상태에 머무르지 않도록 복원해요. */
  const handlePointerCancel: PointerEventHandler<HTMLButtonElement> = event => {
    onPointerCancel?.(event);
    if (!event.defaultPrevented) setInteraction(current => (current === 'down' ? 'up' : current));
  };

  /* 누른 채 항목 바깥으로 이동한 경우에도 원래 크기로 복원해요. */
  const handlePointerLeave: PointerEventHandler<HTMLButtonElement> = event => {
    onPointerLeave?.(event);
    if (!event.defaultPrevented) setInteraction(current => (current === 'down' ? 'up' : current));
  };

  return {
    handlePointerCancel,
    handlePointerDown,
    handlePointerLeave,
    handlePointerUp,
    interaction,
  };
}
