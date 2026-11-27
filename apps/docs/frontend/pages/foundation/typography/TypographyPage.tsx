import { MobileMenu } from '../../../features/docs-navigation/MobileMenu';
import { DocsSearch } from '../../../features/docs-search/DocsSearch';
import { DocsLayout } from '../../../layouts/DocsLayout/DocsLayout';
import { DocsNavigation } from '../../../features/docs-navigation/DocsNavigation';
import { getTypographyData } from './data/getTypographyData';
import { FoundationIntro } from '../common/FoundationIntro';
import { TypographySection } from './sections/TypographySection';
import { typographyHeadings } from './data/typographySections';
import { FoundationSection } from '../common/FoundationSection';
import { DocToc } from '../../../features/docs-toc/DocToc';
import { CodeBlock } from '../../../features/code-block/CodeBlock';
import '../common/Foundation.css';
import './TypographyPage.css';

export function TypographyPage() {
  const styles = getTypographyData();
  return <DocsLayout className="docs-shell--guide" menuAction={<MobileMenu />} navigation={<DocsNavigation />} searchAction={<DocsSearch />} toc={<DocToc items={typographyHeadings} />}>
    <article className="foundation-page foundation-page--typography">
      <FoundationIntro title="Typography">
        <p>제목·본문·라벨의 역할에 맞는 스타일을 선택해요. 글자 크기와 굵기·행간을 같은 기준으로 적용할 수 있어요.</p>
      </FoundationIntro>
      <FoundationSection id="usage" title="사용 방법" description={<p>제공되는 클래스로 폰트 크기·굵기·행간을 함께 적용해요.</p>}>
        <CodeBlock code={'<p className="eli-typo-body-medium">설명을 작성해요.</p>'} label="Typography 클래스 사용" />
      </FoundationSection>
      <TypographySection group="heading" styles={styles.filter(style => style.group === 'heading')} />
      <TypographySection group="body" styles={styles.filter(style => style.group === 'body')} />
      <TypographySection group="label" styles={styles.filter(style => style.group === 'label')} />
    </article>
  </DocsLayout>;
}
