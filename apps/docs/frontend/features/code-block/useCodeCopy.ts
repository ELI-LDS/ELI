import { useEffect, useRef, useState } from 'react';

/** 클립보드 접근은 사용자 동작에서만 실행하고 결과 메시지는 잠깐 표시해요. */
export function useCodeCopy(code: string) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; if (timer.current) clearTimeout(timer.current); };
  }, []);
  const copy = async () => {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(code);
      if (mounted.current) setStatus('success');
    } catch {
      if (mounted.current) setStatus('error');
    }
    if (mounted.current) timer.current = setTimeout(() => setStatus('idle'), 3000);
  };
  return { status, copy };
}
