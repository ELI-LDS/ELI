'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../../shared/ui/button';
import './HomePage.css';

/** 홈 시안을 구현하기 전 상세 문서를 확인하는 임시 진입점이에요. */
export function HomePage() {
  const router = useRouter();
  return <main className="docs-home-preview"><Button icon={null} onClick={() => router.push('/foundation/color')}>Foundation 확인하기</Button></main>;
}
