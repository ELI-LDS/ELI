import { DocPreviewCase } from '../../sections/DocPreviewCase';
import { Button } from '../../../../shared/ui/button';
import type { DocPreview } from '../../data/docPage.types';
import { buttonColors, buttonDocExamples, buttonSizes, buttonVariants } from './button.docs';
import { ButtonClickExample } from './ButtonClickExample';

export const buttonDocPreviews = {
  basic: () => <Button>저장</Button>,
  variants: () => <>{buttonVariants.map(variant => <DocPreviewCase key={variant} value={variant}><Button variant={variant}>저장</Button></DocPreviewCase>)}</>,
  colors: () => <>{buttonColors.map(color => <DocPreviewCase key={color} value={color}><Button color={color}>{color === 'brand' ? '주요 행동' : '보조 행동'}</Button></DocPreviewCase>)}</>,
  sizes: () => <>{buttonSizes.map(size => <DocPreviewCase key={size} value={size}><Button size={size}>저장</Button></DocPreviewCase>)}</>,
  icons: () => <><DocPreviewCase value="<PlusIcon />"><Button>추가</Button></DocPreviewCase><DocPreviewCase value="null"><Button icon={null}>저장</Button></DocPreviewCase></>,
  disabled: () => <><DocPreviewCase value="false"><Button>저장</Button></DocPreviewCase><DocPreviewCase value="true"><Button disabled>저장</Button></DocPreviewCase></>,
  click: ButtonClickExample,
} satisfies Record<typeof buttonDocExamples[number]['id'], DocPreview>;
