import type { ReactNode } from 'react';

/** 비교 대상과 해당 값을 함께 표시해 모양만으로 속성을 추측하지 않게 해요. */
export function DocPreviewCase({ value, children, fullWidth = false }: { value: string; children: ReactNode; fullWidth?: boolean }) {
  return <div className={`doc-preview-case${fullWidth ? ' doc-preview-case--wide' : ''}`}>{children}<code>{value}</code></div>;
}
