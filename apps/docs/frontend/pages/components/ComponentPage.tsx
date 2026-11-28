import { DocsLayout } from '../../layouts/DocsLayout/DocsLayout';
import { DocsNavigation } from '../../features/docs-navigation/DocsNavigation';
import { MobileMenu } from '../../features/docs-navigation/MobileMenu';
import { DocsSearch } from '../../features/docs-search/DocsSearch';
import { DocIntro } from './sections/DocIntro';
import { DocExample } from './sections/DocExample';
import { DocComposition } from './sections/DocComposition';
import { DocSection } from './sections/DocSection';
import { DocProse } from './sections/DocProse';
import { DocGuidance } from './sections/DocGuidance';
import { DocToc } from '../../features/docs-toc/DocToc';
import { InstallationSection } from './sections/InstallationSection';
import { PropsReference } from './sections/PropsReference';
import { docPreviews } from './examples/docPreviews';
import './examples/Examples.css';
import { docSections } from './data/docPage.types';
import type { DocPreview } from './data/docPage.types';
import type { DocPage } from './data/getDocPage';
import './ComponentPage.css';

export function ComponentPage({ document }: { document: DocPage }) {
  const basic = document.examples[0]!;
  const previews: Record<string, DocPreview> = docPreviews[document.id];
  const BasicPreview = previews[basic.id]!;
  // 서버 경계를 넘는 자식 배열에서도 속성·주의사항 블록을 서로 구분해요.
  const references = [{ ...document, isPart: false }, ...document.related].map(item => document.related.length ? <DocSection {...(item.isPart ? { description: item.summary } : {})} id={`api-${item.id}`} key={item.id} level={3} title={item.name}>
    <PropsReference api={item.api} headingLevel={4} key={`${item.id}-props`} />
    {item.isPart && item.composition ? <details className="doc-details" key={`${item.id}-composition`}><summary>조립 시 주의사항과 동작</summary><DocProse markdown={item.composition} /></details> : null}
  </DocSection> : <PropsReference api={item.api} key={item.id} />);
  return <DocsLayout className="docs-shell--guide" menuAction={<MobileMenu />} navigation={<DocsNavigation />} searchAction={<DocsSearch />} toc={document.hasToc ? <DocToc items={document.headings} /> : undefined}>
    <article className="doc-page">
      <DocIntro mobileOnly={document.mobileOnly} name={document.name} summary={document.summary} />
      <DocExample example={basic} importCode={document.importCode}><BasicPreview /></DocExample>
      {document.assembly ? <DocSection {...docSections.composition}><DocComposition assembly={document.assembly} /></DocSection> : null}
      <DocSection {...docSections.installation}><InstallationSection componentId={document.installationIds.join(' ')} /></DocSection>
      {document.exampleGroups.map(group => <DocSection id={group.id} key={group.id} title={group.title}>
        {group.examples.map(example => {
          const Preview = previews[example.id]!;
          return <DocExample example={example} key={example.id} property={example.propertyInfo} propertyOwner={example.propertyOwner}><Preview /></DocExample>;
        })}
      </DocSection>)}
      {document.guidanceItems.some(item => item.guidance || item.details) ? <DocSection {...docSections.guidelines}>
        {document.guidanceItems.map(item => {
          if (!item.guidance && !item.details) return null;
          const body = <>
            {item.guidance ? <DocGuidance headingLevel={document.guidanceItems.length > 1 ? 4 : 3} markdown={item.guidance} /> : null}
            {item.details ? <details className="doc-details"><summary>동작과 스타일 상세</summary><DocProse markdown={item.details} /></details> : null}
          </>;
          return document.guidanceItems.length > 1 ? <DocSection id={`guidelines-${item.id}`} key={item.id} level={3} title={item.name}>{body}</DocSection> : <div className="doc-guide-content" key={item.id}>{body}</div>;
        })}
      </DocSection> : null}
      <DocSection {...document.referenceHeading}>
        {references}
      </DocSection>
      {[document, ...document.related].some(item => item.accessibility) ? <DocSection {...docSections.accessibility}>
        {[document, ...document.related].filter(item => item.accessibility).map(item => document.related.length ? <DocSection id={`accessibility-${item.id}`} key={item.id} level={3} title={item.name}><DocProse markdown={item.accessibility} /></DocSection> : <DocProse markdown={item.accessibility} key={item.id} />)}
      </DocSection> : null}
    </article>
  </DocsLayout>;
}
