import type { ReactNode } from 'react';
import { CodeBlock } from '../../../features/code-block/CodeBlock';
import type { DocExampleDefinition } from '../data/docPage.types';
import { exampleAnchor } from '../data/docPage.types';
import { DocSection } from './DocSection';
import { InstallationSection } from './InstallationSection';
import { NextClientNote } from './NextClientNote';

export function DocExample({ example, children, importCode, property, propertyOwner }: { example: DocExampleDefinition; children: ReactNode; importCode?: string; property?: { name: string; required: boolean; default: unknown } | null; propertyOwner?: string | null }) {
  return <DocSection description={example.description} id={exampleAnchor(example)} level={example.id === 'basic' ? 2 : 3} title={example.title}>
    {example.id !== 'basic' && example.install?.length ? <InstallationSection componentId={example.install.join(' ')} /> : null}
    {property && (propertyOwner || property.required || property.default !== null && property.default !== undefined) ? <div className="doc-property__meta">{propertyOwner ? <code>{propertyOwner}</code> : null}{property.required ? <span className="doc-api__requirement" data-required="true">필수</span> : null}{property.default !== null && property.default !== undefined ? <span>{example.relatedProperties?.length ? <code>{property.name}</code> : null} 기본값 <code>{String(property.default)}</code></span> : null}</div> : null}
    <div aria-label={`${example.title} 미리보기`} className="doc-example__preview" role="group">{children}</div>
    <CodeBlock code={importCode ? `${importCode}\n\n${example.code}` : example.code} label={`${example.title} 핵심 코드`} />
    {example.fullCode ? <details className="doc-details"><summary>전체 실행 예시</summary><CodeBlock code={example.fullCode} defaultExpanded label={`${example.title} 전체 코드`} />{/(useState|useId|on[A-Z]\w*=)/.test(example.fullCode) ? <NextClientNote /> : null}</details> : null}
  </DocSection>;
}
