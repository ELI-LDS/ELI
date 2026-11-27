import { DocPreviewCase } from '../../sections/DocPreviewCase';
import { Badge } from '../../../../shared/ui/badge';
import type { DocPreview } from '../../data/docPage.types';
import { badgeDocExamples, badgeSizes, badgeTypes } from './badge.docs';

export const badgeDocPreviews = {
  basic: () => <Badge>신규</Badge>,
  meaning: () => <>{badgeTypes.map(({ type, label }) => <DocPreviewCase key={type} value={type}><Badge type={type}>{label}</Badge></DocPreviewCase>)}</>,
  sizes: () => <>{badgeSizes.map(size => <DocPreviewCase key={size} value={size}><Badge size={size}>신규</Badge></DocPreviewCase>)}</>,
  labels: () => <><DocPreviewCase value="신규"><Badge>신규</Badge></DocPreviewCase><DocPreviewCase value="승인 완료"><Badge type="success">승인 완료</Badge></DocPreviewCase></>,
} satisfies Record<typeof badgeDocExamples[number]['id'], DocPreview>;
