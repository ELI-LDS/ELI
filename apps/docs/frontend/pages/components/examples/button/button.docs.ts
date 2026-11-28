import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const buttonVariants = ['solid', 'outline', 'ghost'] as const;
export const buttonColors = ['brand', 'neutral'] as const;
export const buttonSizes = ['large', 'medium'] as const;
export const buttonDocExamples = [
  { id: 'basic', title: '기본 사용', description: '텍스트로 실행할 행동을 알려줘요. 기본 크기는 `large`, 색상은 `brand`, 형태는 `solid`예요.', code: '<Button>저장</Button>' },
  { id: 'sizes', section: 'properties', property: 'size', title: '크기', description: '`large`가 기본이며 상대적으로 작은 버튼이 필요하면 `medium`을 사용해요.', code: buttonSizes.map(size => `<Button size="${size}">저장</Button>`).join('\n') },
  { id: 'variants', section: 'properties', property: 'variant', title: '형태', description: '`solid`·`outline`·`ghost`로 강조 수준을 선택해요. 각 조합의 권장 상황은 아래 선택 기준을 참고해요.', code: buttonVariants.map(variant => `<Button variant="${variant}">저장</Button>`).join('\n') },
  { id: 'colors', section: 'properties', property: 'color', title: '색상', description: '`brand`는 브랜드 행동에, `neutral`은 일반적인 보조 행동에 사용해요.', code: '<Button color="brand">주요 행동</Button>\n<Button color="neutral">보조 행동</Button>' },
  { id: 'icons', section: 'properties', property: 'icon', title: '아이콘', description: '기본 Plus 아이콘은 텍스트 앞에 표시돼요. **텍스트만 사용하려면** `icon={null}`을 전달해요.', code: '<Button>추가</Button>\n<Button icon={null}>저장</Button>' },
  { id: 'disabled', section: 'interactions', property: 'disabled', title: '비활성화', description: '`disabled`를 전달하면 **클릭과 키보드 실행을 막아요.**', code: '<Button>저장</Button>\n<Button disabled>저장</Button>' },
  { id: 'click', section: 'interactions', property: 'onClick', title: '클릭 연결', description: '`onClick`에 기능을 연결해요. 이 예시는 클릭하면 버튼 문구를 저장됨으로 바꿔요.', code: '<Button onClick={() => setSaved(true)}>\n  {saved ? "저장됨" : "저장"}\n</Button>', fullCode: `import { useState } from 'react';
import { Button } from './components/ui/button';

export default function SaveButton() {
  const [saved, setSaved] = useState(false);
  return (
    <Button onClick={() => setSaved(true)}>
      {saved ? "저장됨" : "저장"}
    </Button>
  );
}` },
] as const satisfies readonly DocExampleDefinition[];
