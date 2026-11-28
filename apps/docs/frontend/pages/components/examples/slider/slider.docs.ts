import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const sliderDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "하나의 값을 선택하는 기본 슬라이더예요.",
    code: `<Slider aria-label="볼륨" defaultValue={50} />`,
  },
  {
    id: "range", section: 'properties', property: 'variant',
    title: "범위 선택",
    description: "`variant=\"range\"`에 시작 값과 끝 값을 전달해요.",
    code: `<Slider aria-label="가격 범위" variant="range" defaultValue={[25, 60]} />`,
  },
  {
    id: "controlled", section: 'interactions', property: 'value', relatedProperties: ['onValueChange'],
    title: "값 연결",
    description: "`onValueChange`에서 다음 숫자를 받아 사용하는 기능에 연결해요.",
    code: `<Slider aria-label="볼륨" value={volume} onValueChange={setVolume} min={0} max={100} step={5} />`,
    fullCode: `import { useState } from 'react';
import { Slider } from './components/ui/slider';

export default function Example() {
  const [volume, setVolume] = useState(50);
  return (
    <div><Slider aria-label="볼륨" value={volume} onValueChange={setVolume} min={0} max={100} step={5} /></div>
  );
}`,
  },
] as const satisfies readonly DocExampleDefinition[];
