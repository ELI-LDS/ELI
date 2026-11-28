import { useId, useRef, useState } from 'react';

/** 초기 서버 마크업을 유지하며 한 번 펼친 코드를 계속 볼 수 있게 해요. */
export function useCodeBlock(defaultExpanded: boolean) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const contentId = useId();
  const contentRef = useRef<HTMLPreElement>(null);
  const expand = () => {
    setExpanded(true);
    /* 펼치기 버튼이 사라져도 키보드 사용자가 곧바로 코드를 스크롤할 수 있게 해요. */
    contentRef.current?.focus({ preventScroll: true });
  };
  return { expanded, contentId, contentRef, expand };
}
