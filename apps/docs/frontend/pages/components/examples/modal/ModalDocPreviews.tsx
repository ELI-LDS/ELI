import type { DocPreview } from '../../data/docPage.types';
import { ModalOpenExample } from './ModalOpenExample';
import { ModalActionExample } from './ModalActionExample';
import { modalBasicProps, modalContentProps, modalDocExamples } from './modal.docs';

export const modalDocPreviews = {
  basic: () => <ModalOpenExample content={modalBasicProps} />,
  content: () => <ModalOpenExample content={modalContentProps} />,
  actions: ModalActionExample,
} satisfies Record<typeof modalDocExamples[number]['id'], DocPreview>;
