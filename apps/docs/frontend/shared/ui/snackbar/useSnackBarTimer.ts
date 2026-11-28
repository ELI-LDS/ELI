import { useEffect, useRef, useState } from 'react';

interface UseSnackBarTimerOptions {
  open: boolean;
  duration: number;
  onExpire: () => void;
}

/** 읽거나 액션을 고르는 동안 남은 시간을 보존해요. 서버에서는 타이머를 만들지 않아요. */
export function useSnackBarTimer({ open, duration, onExpire }: UseSnackBarTimerOptions) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const remaining = useRef(duration);
  const expire = useRef(onExpire);
  const paused = hovered || focused || unavailable;

  useEffect(() => { expire.current = onExpire; }, [onExpire]);

  useEffect(() => {
    if (!open) return;
    const update = () => setUnavailable(document.hidden || !document.hasFocus());
    const blur = () => setUnavailable(true);
    update();
    document.addEventListener('visibilitychange', update);
    window.addEventListener('blur', blur);
    window.addEventListener('focus', update);
    return () => {
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('blur', blur);
      window.removeEventListener('focus', update);
    };
  }, [open]);

  // 다시 표시할 때 이전의 마우스·포커스 상태를 이어받지 않아요.
  useEffect(() => {
    remaining.current = duration;
    if (!open) {
      setHovered(false);
      setFocused(false);
    }
  }, [open, duration]);

  useEffect(() => {
    if (!open || duration === 0 || paused) return;
    const started = performance.now();
    const timer = window.setTimeout(() => {
      remaining.current = 0;
      expire.current();
    }, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [open, duration, paused]);

  return { setHovered, setFocused };
}
