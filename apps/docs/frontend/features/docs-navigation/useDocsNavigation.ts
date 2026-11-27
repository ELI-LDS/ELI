import { usePathname, useRouter } from 'next/navigation';
import { foundationLinks, componentLinks } from '../docs-catalog/navigation';

/** 선택 표시를 실제 URL과 연결해 뒤로 가기와 직접 접근에도 같은 항목을 표시해요. */
export function useDocsNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const links = [...foundationLinks, ...componentLinks];
  const selected = links.find(link => pathname === link.value)?.value ?? '';
  const navigate = (value: string) => {
    if (links.some(link => link.value === value)) router.push(value);
  };
  return { selected, navigate };
}
