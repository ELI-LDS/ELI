import type { Metadata } from 'next';
import { ColorPage } from '../../../frontend/pages/foundation/color/ColorPage';

export const metadata: Metadata = { title: 'Color | ELI', description: 'ELI의 Primitive·Semantic 색상 토큰과 사용 역할을 확인해요.' };

export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  return <ColorPage tab={tab === 'semantic' ? 'semantic' : 'primitive'} />;
}
