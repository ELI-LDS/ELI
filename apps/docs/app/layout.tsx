import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../frontend/shared/styles/site';
import './globals.css';

export const metadata: Metadata = {
  title: 'ELI',
  description: 'ELI React 디자인 컴포넌트 라이브러리',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // 목차의 부드러운 스크롤은 유지하되 Next.js 페이지 전환에서는 즉시 위치를 바꿔요.
    <html data-scroll-behavior="smooth" lang="ko">
      <body>{children}</body>
    </html>
  );
}
