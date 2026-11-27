import type { ReactNode } from 'react';
import { Header, HeaderAction } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import './DocsLayout.css';

interface DocsLayoutProps {
  children: ReactNode;
  /** 탐색 기능은 페이지에서 조립해 전달하고 레이아웃이 기능을 소유하지 않아요. */
  navigation: ReactNode;
  menuAction?: ReactNode;
  searchAction?: ReactNode;
  className?: string;
  toc?: ReactNode;
}

/** Header·탐색 영역·서버 본문·Footer의 배치를 여러 상세 페이지에서 공유해요. */
export function DocsLayout({ children, navigation, menuAction, searchAction, className, toc }: DocsLayoutProps) {
  return (
    <div className={['docs-shell', className].filter(Boolean).join(' ')}>
      <a className="docs-shell__skip" href="#docs-main">본문으로 이동</a>
      <Header
        className="docs-shell__header"
        links={[
          { label: '시작하기', href: '', pending: true },
          { label: 'Foundation', href: '/foundation/color' },
          { label: 'Components', href: '/components/button' },
        ]}
        menuAction={menuAction ?? <HeaderAction action="menu" aria-label="메뉴 · 준비 중" disabled title="모바일 메뉴는 준비 중이에요" />}
        searchAction={searchAction ?? <HeaderAction action="search" aria-label="검색 · 준비 중" disabled title="검색은 준비 중이에요" />}
      />
      <div className="docs-shell__body">
        <aside aria-label="문서 탐색" className="docs-shell__sidebar"><div className="docs-shell__sidebar-scroll">{navigation}</div></aside>
        <main id="docs-main" tabIndex={-1}>{children}</main>
        {toc ? <aside className="docs-shell__toc">{toc}</aside> : null}
      </div>
      {/* 최종 문구를 받기 전까지 임시 문구를 서비스에 노출하지 않아요. */}
      <Footer>{null}</Footer>
    </div>
  );
}
