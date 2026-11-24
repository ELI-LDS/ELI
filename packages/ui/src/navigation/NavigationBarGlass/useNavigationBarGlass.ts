import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';
import { useSelection } from '../../shared/useSelection.js';
import type { NavigationBarGlassProps } from './NavigationBarGlass.types.js';

interface UseNavigationBarGlassOptions {
  defaultValue: NavigationBarGlassProps['defaultValue'];
  items: NavigationBarGlassProps['items'];
  onValueChange: NavigationBarGlassProps['onValueChange'];
  value: NavigationBarGlassProps['value'];
}

interface ActivePointer {
  id: number;
  startX: number;
  isDragging: boolean;
}

interface PointerPosition {
  index: number;
  localX: number;
}

const itemSelector = '.eli-navigation-bar-glass-item';

/* 제어·비제어 선택, 포인터 제스처와 indicator 동기화를 관리해요. */
export function useNavigationBarGlass({
  defaultValue,
  items,
  onValueChange,
  value,
}: UseNavigationBarGlassOptions) {
  const { selectedValue, selectValue } = useSelection({
    defaultValue, options: items.map(item => ({ value: item.value })), onValueChange, value,
  });
  /* 눌림과 드래그 상태만 렌더링에 사용하고 포인터 위치는 ref로 관리해요. */
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const activePointerRef = useRef<ActivePointer | null>(null);
  const instantFrameRef = useRef<number | null>(null);
  const isFirstSyncRef = useRef(true);
  const selectedIndex = items.findIndex(item => item.value === selectedValue);
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;

  /* 트랙 크기에 맞춰 indicator의 위치와 너비를 직접 갱신해요. */
  const setIndicatorPosition = useCallback(
    (index: number, centerAt?: number) => {
      const track = trackRef.current;
      const indicator = indicatorRef.current;
      const count = track?.querySelectorAll(itemSelector).length ?? 0;
      if (!track || !indicator || !track.offsetWidth || !count) return;

      const slotWidth = track.offsetWidth / count;
      const start = centerAt === undefined
        ? index * slotWidth
        : centerAt - slotWidth / 2;
      const left = Math.max(0, Math.min(start, track.offsetWidth - slotWidth));

      indicator.style.setProperty(
        '--eli-navigation-bar-glass-indicator-x',
        `${left}px`,
      );
      indicator.style.setProperty(
        '--eli-navigation-bar-glass-indicator-width',
        `${slotWidth}px`,
      );
    },
    [],
  );

  /* 포인터 좌표를 변형된 트랙의 내부 좌표로 환산해요. */
  const getPointerPosition = useCallback(
    (clientX: number): PointerPosition | undefined => {
      const track = trackRef.current;
      const count = track?.querySelectorAll(itemSelector).length ?? 0;
      if (!track || !track.offsetWidth || !count) return undefined;

      const rect = track.getBoundingClientRect();
      const scale = rect.width / track.offsetWidth || 1;
      const localX = Math.max(
        0,
        Math.min((clientX - rect.left) / scale, track.offsetWidth),
      );
      const slotWidth = track.offsetWidth / count;

      return {
        index: Math.min(count - 1, Math.floor(localX / slotWidth)),
        localX,
      };
    },
    [],
  );

  /* 드래그 중 손가락 아래의 아이콘만 강조해요. */
  const setHotItem = useCallback((hotIndex?: number) => {
    const buttons = trackRef.current?.querySelectorAll<HTMLButtonElement>(itemSelector);
    buttons?.forEach((button, index) => {
      if (index === hotIndex) button.setAttribute('data-hot', 'true');
      else button.removeAttribute('data-hot');
    });
  }, []);

  /* 양 끝 탭에서 바를 살짝 늘리고, 제스처가 끝나면 원위치해요. */
  const setEdgeStretch = useCallback((edge?: 'start' | 'end') => {
    const navigation = trackRef.current?.parentElement;
    if (!navigation) return;

    if (edge) navigation.setAttribute('data-edge', edge);
    else navigation.removeAttribute('data-edge');
  }, []);

  /* 초기 렌더와 선택값 변경을 화면에 그리기 전에 반영해요. */
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const instant = isFirstSyncRef.current;
    if (instant) {
      track.setAttribute('data-instant', 'true');
      if (instantFrameRef.current !== null) {
        cancelAnimationFrame(instantFrameRef.current);
      }
      instantFrameRef.current = requestAnimationFrame(() => {
        track.removeAttribute('data-instant');
        instantFrameRef.current = null;
      });
    }

    setIndicatorPosition(selectedIndex);
    isFirstSyncRef.current = false;
  }, [selectedIndex, selectedValue, items.length, setIndicatorPosition]);

  /* 크기가 바뀌면 선택 위치를 트랜지션 없이 다시 맞춰요. */
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(() => {
      if (!track.offsetWidth) return;

      track.setAttribute('data-instant', 'true');
      if (instantFrameRef.current !== null) {
        cancelAnimationFrame(instantFrameRef.current);
      }
      setIndicatorPosition(selectedIndexRef.current);
      instantFrameRef.current = requestAnimationFrame(() => {
        track.removeAttribute('data-instant');
        instantFrameRef.current = null;
      });
    });
    observer.observe(track);

    return () => {
      observer.disconnect();
      if (instantFrameRef.current !== null) {
        cancelAnimationFrame(instantFrameRef.current);
        instantFrameRef.current = null;
      }
    };
  }, [items.length, setIndicatorPosition]);

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      !event.isPrimary
      || (event.pointerType === 'mouse' && event.button !== 0)
      || activePointerRef.current
    ) {
      return;
    }

    /* 트랙이 포인터를 캡처해 항목 사이를 이동해도 제스처를 이어가요. */
    activePointerRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      isDragging: false,
    };
    setIsPressed(true);
    setIsDragging(false);
    setHotItem();
    setEdgeStretch();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const activePointer = activePointerRef.current;
    if (!activePointer || activePointer.id !== event.pointerId) return;

    if (
      !activePointer.isDragging
      && Math.abs(event.clientX - activePointer.startX) <= 3
    ) {
      return;
    }

    /* 3px을 넘긴 이동부터 드래그로 보고 indicator를 손가락에 맞춰요. */
    activePointer.isDragging = true;
    setIsDragging(true);
    const pointerPosition = getPointerPosition(event.clientX);
    if (!pointerPosition) return;

    setIndicatorPosition(pointerPosition.index, pointerPosition.localX);
    setHotItem(pointerPosition.index);
    setEdgeStretch(
      pointerPosition.index === 0
        ? 'start'
        : pointerPosition.index === items.length - 1
          ? 'end'
          : undefined,
    );
  };

  const finishPointer = (
    event: ReactPointerEvent<HTMLDivElement>,
    cancelled: boolean,
  ) => {
    const activePointer = activePointerRef.current;
    if (!activePointer || activePointer.id !== event.pointerId) return;

    activePointerRef.current = null;
    setHotItem();
    setEdgeStretch();
    setIsPressed(false);
    setIsDragging(false);

    /* 취소는 선택값을 바꾸지 않고 복귀하며, 정상 종료는 가장 가까운 항목을 선택해요. */
    if (cancelled) {
      setIndicatorPosition(selectedIndex);
    } else {
      const pointerPosition = getPointerPosition(event.clientX);
      const nextItem = pointerPosition && items[pointerPosition.index];

      // 부모가 제어 값을 유지하면 indicator도 기존 선택 위치로 돌아가요.
      if (pointerPosition && nextItem) {
        setIndicatorPosition(value === undefined ? pointerPosition.index : selectedIndex);
        selectValue(nextItem.value);
      } else {
        setIndicatorPosition(selectedIndex);
      }
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    finishPointer(event, false);
  };

  const handlePointerCancel = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    finishPointer(event, true);
  };

  const handleLostPointerCapture = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (activePointerRef.current?.id === event.pointerId) {
      finishPointer(event, true);
    }
  };

  const handleItemClick = (
    itemValue: string,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    /* 포인터 선택은 트랙에서 처리하므로 click은 키보드 활성화만 맡아요. */
    if (event.detail === 0) selectValue(itemValue);
  };

  const handleItemKeyDown = (
    index: number,
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    const buttons = trackRef.current
      ?.querySelectorAll<HTMLButtonElement>(itemSelector);
    if (!buttons?.length) return;

    /* 방향키는 선택값을 바꾸지 않고 인접 항목으로 포커스만 옮겨요. */
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + direction + buttons.length) % buttons.length;
    buttons[nextIndex]?.focus();
  };

  return {
    handleItemClick,
    handleItemKeyDown,
    handleLostPointerCapture,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    indicatorRef,
    isDragging,
    isPressed,
    selectedValue,
    trackRef,
  };
}
