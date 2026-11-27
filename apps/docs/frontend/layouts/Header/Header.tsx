import './Header.css';
import '../../shared/styles/site';
import type { HeaderActionProps, HeaderProps } from './Header.types';

/** 검색·메뉴 기능을 연결할 때 같은 아이콘과 누를 영역을 재사용해요. */
export function HeaderAction({ action, className, type = 'button', ...props }: HeaderActionProps) {
  return (
    <button
      aria-label={action === 'search' ? '검색 열기' : '메뉴 열기'}
      {...props}
      className={['docs-header__action', className].filter(Boolean).join(' ')}
      type={type}
    >
      <img alt="" src={`/assets/${action}.svg`} width={24} height={24} />
    </button>
  );
}

/** 페이지 탐색을 서버에서 표시하고 검색·메뉴 기능은 사용처에서 조립해요. */
export function Header(props: HeaderProps) {
  const {
    links = [], homeHref = '/', githubHref = 'https://github.com/ELI-team/ELI',
    searchAction, menuAction, className, ...headerProps
  } = props;

  return (
    <header {...headerProps} className={['docs-header', className].filter(Boolean).join(' ')}>
      <div className="docs-header__content">
        <a aria-label="ELI 홈" className="docs-header__home" href={homeHref}>
          <img alt="" className="docs-header__wordmark" src="/assets/eli-wordmark.svg" width={61} height={20} />
          <img alt="" className="docs-header__symbol" src="/assets/eli-symbol.svg" width={24} height={24} />
        </a>
        <div className="docs-header__tools">
          <nav aria-label="주요 페이지" className="docs-header__navigation eli-typo-body-medium">
            {links.map((link, index) => link.pending
              ? <span key={index} title="준비 중">{link.label}<span className="docs-sr-only"> · 준비 중</span></span>
              : <a href={link.href} key={index}>{link.label}</a>)}
          </nav>
          <a aria-label="ELI GitHub 저장소" className="docs-header__github" href={githubHref} rel="noopener noreferrer" target="_blank">
            <img alt="" src="/assets/github.svg" width={26.88} height={26.25} />
          </a>
          {searchAction ?? <HeaderAction action="search" />}
          <div className="docs-header__mobile-menu">{menuAction ?? <HeaderAction action="menu" />}</div>
        </div>
      </div>
    </header>
  );
}
