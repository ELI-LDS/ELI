'use client';

import { HeaderAction } from '../../layouts/Header/Header';
import { Overlay } from '../../shared/ui/Overlay/Overlay';
import { MenuItem } from '../../shared/ui/menu-item';
import { useDocsSearch } from './useDocsSearch';
import './DocsSearch.css';
import './DocsSearch.motion.css';

/** 모바일 키보드는 실제 input이 호출해요. 시안의 OS 키보드를 가짜 UI로 만들지 않아요. */
export function DocsSearch() {
  const { open, setOpen, query, setQuery, results } = useDocsSearch();
  return <div className="docs-search">
    <span className="docs-search__mobile"><HeaderAction action="search" onClick={event => { event.currentTarget.focus({ preventScroll: true }); setOpen(true); }} /></span>
    <span className="docs-search__desktop"><HeaderAction action="search" aria-label="검색 · 준비 중" disabled title="데스크톱 검색은 준비 중이에요" /></span>
    <Overlay label="문서 검색" onClose={() => setOpen(false)} open={open} className="docs-search-overlay" closeOnBackdrop>
      {close => <>
        <form className="docs-search__field" onSubmit={event => { event.preventDefault(); const first = results.find(result => result.href); if (first) window.location.assign(first.href); }} role="search">
          <input aria-label="컴포넌트 검색" autoComplete="off" className="eli-typo-body-medium" data-autofocus onChange={event => setQuery(event.currentTarget.value)} placeholder="검색어를 입력하세요" type="search" value={query} />
          <button aria-label="검색" type="submit"><img alt="" height={24} src="/assets/search-subtle.svg" width={24} /></button>
        </form>
        {query.trim() ? <div aria-label="검색 결과" className="docs-search__results" role="region">
          {results.length ? results.map(result => result.href
            ? <MenuItem key={result.label} onClick={() => { close(); window.location.assign(result.href); }}>{result.label}</MenuItem>
            : <p className="docs-search__pending eli-typo-body-medium" key={result.label} title="준비 중">{result.label}<span className="docs-sr-only"> · 준비 중</span></p>)
            : <p aria-live="polite" className="docs-search__empty eli-typo-body-medium">검색 결과가 없어요.</p>}
        </div> : null}
      </>}
    </Overlay>
  </div>;
}
