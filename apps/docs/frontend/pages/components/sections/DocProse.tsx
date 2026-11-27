import { parseDocument } from '../data/parseDocument';
import { DocumentContent } from './DocumentContent';

/** 공용 조회 결과의 Markdown을 사용하고 문서 제목용 가상 구역은 표시하지 않아요. */
export function DocProse({ markdown }: { markdown: string }) {
  return <div className="doc-prose"><DocumentContent blocks={parseDocument(`## 안내\n${markdown}`).slice(1)} /></div>;
}
