import { useSearchParams } from 'next/navigation';
import type { ColorTab } from '../color.types';

/** 탭과 목차가 같은 URL 선택값을 읽도록 해요. */
export function useActiveColorTab(initialTab: ColorTab): ColorTab {
  const params = useSearchParams();
  return (params.get('tab') ?? initialTab) === 'semantic' ? 'semantic' : 'primitive';
}
