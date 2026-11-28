import type { Metadata } from 'next';
import { LayoutPage } from '../../../frontend/pages/foundation/layout/LayoutPage';

export const metadata: Metadata = { title: 'Layout | ELI', description: 'ELI의 간격·모서리·반응형 레이아웃 토큰을 확인해요.' };
export default function Page() { return <LayoutPage />; }
