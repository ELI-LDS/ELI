export function DocIntro({ name, summary, mobileOnly = false }: { name: string; summary: string; mobileOnly?: boolean }) {
  return <header className="doc-intro">
    <div className="doc-intro__heading">
      <h1 className="eli-typo-heading-h2">{name}</h1>
      {mobileOnly ? <span aria-label="모바일 전용" className="doc-platform">Mobile</span> : null}
    </div>
    <p className="eli-typo-body-medium">{summary}</p>
  </header>;
}
