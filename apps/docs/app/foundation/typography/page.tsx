import type { Metadata } from 'next';
import { TypographyPage } from '../../../frontend/pages/foundation/typography/TypographyPage';

export const metadata: Metadata = { title: 'Typography | ELI', description: 'ELI의 Heading·Body·Label 타이포그래피를 확인해요.' };
export default function Page() { return <TypographyPage />; }
