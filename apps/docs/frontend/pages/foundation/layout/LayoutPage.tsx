import { MobileMenu } from '../../../features/docs-navigation/MobileMenu';
import { DocsSearch } from '../../../features/docs-search/DocsSearch';
import { DocsLayout } from '../../../layouts/DocsLayout/DocsLayout';
import { DocsNavigation } from '../../../features/docs-navigation/DocsNavigation';
import { getLayoutData, layoutHeadings, layoutSections } from './data/getLayoutData';
import { FoundationIntro } from '../common/FoundationIntro';
import { ScaleSection } from './sections/ScaleSection';
import { SpacingSection } from './sections/SpacingSection';
import { RadiusSection } from './sections/RadiusSection';
import { TokenReference } from './sections/TokenReference';
import { DocToc } from '../../../features/docs-toc/DocToc';
import { FoundationSection } from '../common/FoundationSection';
import { FoundationOverview } from '../common/FoundationOverview';
import { CodeBlock } from '../../../features/code-block/CodeBlock';
import '../common/Foundation.css';
import './LayoutPage.css';

export function LayoutPage() {
  const { scale, responsive } = getLayoutData();
  return <DocsLayout className="docs-shell--guide" menuAction={<MobileMenu />} navigation={<DocsNavigation />} searchAction={<DocsSearch />} toc={<DocToc items={layoutHeadings} />}>
    <article className="foundation-page foundation-page--layout">
      <FoundationIntro title="Layout">
        <p>공통 스케일로 간격과 모서리 둥글기를 맞춰 화면의 밀도와 형태를 일관되게 유지해요.</p>
      </FoundationIntro>
      <FoundationOverview items={[
        { name: 'Spacing', description: '요소 안쪽 여백과 요소 사이의 간격이에요. padding과 gap에 같은 스케일을 연결해요.' },
        { name: 'Radius', description: '컴포넌트 모서리의 둥글기예요. 형태와 역할에 맞는 값을 선택해요.' },
      ]} />
      <FoundationSection {...layoutSections.usage} description={<p>크기 값을 반복해서 작성하는 대신 같은 토큰을 연결해요.</p>}>
        <CodeBlock code={'.panel {\n  display: flex;\n  padding: var(--eli-layout-scale-4);\n  gap: var(--eli-layout-scale-2);\n  border-radius: var(--eli-layout-scale-2);\n}'} label="Layout 토큰 사용" language="css" />
      </FoundationSection>
      <ScaleSection scale={scale} />
      <SpacingSection scale={scale} />
      <RadiusSection scale={scale} />
      <TokenReference tokens={[...scale, ...responsive]} />
    </article>
  </DocsLayout>;
}
