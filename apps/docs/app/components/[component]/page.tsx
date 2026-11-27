import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { componentPages } from '../../../frontend/features/docs-catalog/catalog';
import { ComponentPage } from '../../../frontend/pages/components/ComponentPage';
import { getDocPage } from '../../../frontend/pages/components/data/getDocPage';

export function generateStaticParams() { return componentPages.map(page => ({ component: page.id })); }

export async function generateMetadata({ params }: { params: Promise<{ component: string }> }): Promise<Metadata> {
  const { component } = await params;
  const page = componentPages.find(item => item.id === component);
  return { title: page ? `${page.label} | ELI` : 'ELI', description: page ? `${page.label}의 용도와 사용 예시·속성을 확인해요.` : '' };
}

export default async function Page({ params }: { params: Promise<{ component: string }> }) {
  const { component } = await params;
  const page = componentPages.find(item => item.id === component);
  const document = page ? getDocPage(page.id) : null;
  if (!page || !document) notFound();
  return <ComponentPage document={document} />;
}
