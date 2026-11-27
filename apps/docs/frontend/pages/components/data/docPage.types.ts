import type { ReactNode } from 'react';

import type { DocHeading } from '../../../features/docs-toc/types';
export type { DocHeading };
export interface DocExampleDefinition {
  id: string;
  title: string;
  description: string;
  code: string;
  fullCode?: string;
  /** 시각적인 속성 비교·상태와 이벤트·소비 앱의 조합 예시를 구분해요. */
  section?: 'properties' | 'interactions' | 'examples';
  /** 실제 조회 결과에서 이름·필수 여부·기본값을 연결할 속성이에요. */
  property?: string;
  /** 선택값과 콜백처럼 함께 연결하는 실제 속성이에요. */
  relatedProperties?: readonly string[];
  /** 상위 문서 안에서 별도 구성 컴포넌트의 속성을 설명할 때 지정해요. */
  component?: string;
  /** 이 예시에 필요한 별도 소스 설치 항목이에요. */
  install?: readonly string[];
  /** 사용자가 요청한 후속 설치 방식을 문서에 먼저 반영했음을 기록해요. */
  installStatus?: 'planned';
  /** 기본 예시에서 함께 가져오는 조립 부품의 import예요. */
  imports?: readonly string[];
}
export type DocPreview = () => ReactNode;

export const docSections = {
  usage: { id: 'usage', title: '기본 사용' },
  composition: { id: 'composition', title: '구성' },
  installation: { id: 'installation', title: '설치' },
  examples: { id: 'examples', title: '조합 예시' },
  properties: { id: 'properties', title: 'Properties' },
  interactions: { id: 'interactions', title: '상태와 이벤트' },
  guidelines: { id: 'guidelines', title: '선택 기준과 주의사항' },
  api: { id: 'api', title: '전체 속성' },
  accessibility: { id: 'accessibility', title: '접근성' },
} satisfies Record<string, DocHeading>;

export const exampleAnchor = (example: DocExampleDefinition) => example.id === 'basic' ? docSections.usage.id : `example-${example.id}`;
