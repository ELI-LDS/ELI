import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const badgeTypes = [{ type: 'neutral', label: '일반' }, { type: 'error', label: '오류' }, { type: 'success', label: '완료' }, { type: 'caution', label: '주의' }] as const;
export const badgeSizes = ['large', 'medium'] as const;
export const badgeDocExamples = [
  { id: 'basic', title: '기본 사용', description: '상태나 분류를 짧은 텍스트로 표시해요. 기본 크기는 `medium`이며 **클릭 동작이 없는 표시**예요.', code: '<Badge>신규</Badge>' },
  { id: 'sizes', section: 'properties', property: 'size', title: '크기', description: '`large`·`medium` 두 크기를 제공해요. 주변 UI와의 위계에 맞춰 선택해요.', code: badgeSizes.map(size => `<Badge size="${size}">신규</Badge>`).join('\n') },
  { id: 'meaning', section: 'properties', property: 'type', title: '의미별 색상', description: '전달할 상태에 맞는 `type`을 선택하고 색상과 함께 의미를 설명하는 텍스트를 표시해요.', code: badgeTypes.map(({ type, label }) => `<Badge type="${type}">${label}</Badge>`).join('\n') },
  { id: 'labels', section: 'properties', property: 'children', title: '라벨 작성', description: '긴 문장 대신 상태를 바로 이해할 수 있는 짧은 문구를 사용해요.', code: '<Badge>신규</Badge>\n<Badge type="success">승인 완료</Badge>' },
] as const satisfies readonly DocExampleDefinition[];
