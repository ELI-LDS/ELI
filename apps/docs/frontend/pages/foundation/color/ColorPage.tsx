import { MobileMenu } from '../../../features/docs-navigation/MobileMenu';
import { DocsSearch } from '../../../features/docs-search/DocsSearch';
import { DocsLayout } from '../../../layouts/DocsLayout/DocsLayout';
import { DocsNavigation } from '../../../features/docs-navigation/DocsNavigation';
import { getColorData } from './data/getColorData';
import type { ColorTab } from './color.types';
import { FoundationIntro } from '../common/FoundationIntro';
import { PrimitiveColors } from './sections/PrimitiveColors';
import { SemanticColors } from './sections/SemanticColors';
import { ColorTabs } from './sections/ColorTabs';
import { ColorToc } from './sections/ColorToc';
import { colorHeadings } from './data/colorHeadings';
import { FoundationOverview } from '../common/FoundationOverview';
import { FoundationSection } from '../common/FoundationSection';
import { CodeBlock } from '../../../features/code-block/CodeBlock';
import '../common/Foundation.css';
import './ColorPage.css';

export function ColorPage({ tab }: { tab: ColorTab }) {
  const { primitive, semantic } = getColorData();
  return <DocsLayout className="docs-shell--guide" menuAction={<MobileMenu />} navigation={<DocsNavigation />} searchAction={<DocsSearch />} toc={<ColorToc initialTab={tab} primitive={colorHeadings('primitive', primitive)} semantic={colorHeadings('semantic', semantic)} />}>
    <article className="foundation-page foundation-page--color">
      <FoundationIntro title="Color">
        <p>색상 값은 Primitive로 관리하고, 실제 UI에는 역할에 맞는 <strong>Semantic 토큰</strong>을 사용해요.</p>
      </FoundationIntro>
      <FoundationOverview items={[
        { name: 'Primitive', description: '색상 계열과 명도 단계로 구성한 기본 팔레트예요. Semantic 토큰이 이 값을 참조해요.' },
        { name: 'Semantic', description: '텍스트·배경·테두리처럼 UI에서 쓰는 역할을 나타내요. 색상이 바뀌어도 사용 목적을 유지할 수 있어요.' },
      ]} />
      <FoundationSection id="usage" title="사용 방법" description={<p>CSS 값을 직접 반복하기보다 <code>var()</code>로 역할에 맞는 토큰을 연결해요.</p>}>
        <CodeBlock code={'.surface {\n  color: var(--eli-foreground-default);\n  background: var(--eli-background-default);\n  border: 1px solid var(--eli-border-subtle);\n}'} label="Semantic 토큰 사용" language="css" />
      </FoundationSection>
      <ColorTabs initialTab={tab} primitive={<PrimitiveColors groups={primitive} />} semantic={<SemanticColors groups={semantic} />} />
    </article>
  </DocsLayout>;
}
