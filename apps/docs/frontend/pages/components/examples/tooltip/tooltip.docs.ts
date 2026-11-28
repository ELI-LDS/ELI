import type { DocExampleDefinition } from '../../data/docPage.types.ts';

export const tooltipDocExamples = [
  {
    id: "basic",
    title: "기본 사용",
    description: "대상을 보조하는 짧은 설명을 표시해요. 트리거와 표시 시점은 소비 앱이 관리해요.",
    code: `<Tooltip>작성 중인 내용은 자동으로 저장돼요.</Tooltip>`,
  },
  {
    id: "trigger", section: "examples",
    title: "Hover·포커스와 연결",
    description: "마우스 Hover와 키보드 포커스로 열고 Escape·포커스 이탈로 닫아요. `aria-describedby`로 대상을 연결해요.",
    code: `<button aria-describedby={open ? tooltipId : undefined}
  onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
  onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
>마우스를 올려보세요</button>
{open ? <Tooltip id={tooltipId} style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0 }}>툴팁 설명입니다.</Tooltip> : null}`,
    fullCode: `import { useId, useState } from 'react';
import { Tooltip } from './components/ui/tooltip';

export default function Example() {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  return <div style={{ position: 'relative' }}><button aria-describedby={open ? tooltipId : undefined} className="eli-typo-body-medium" onBlur={() => setOpen(false)} onFocus={() => setOpen(true)} onKeyDown={event => {
    if (event.key === 'Escape')
      setOpen(false);
  }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} type="button">마우스를 올려보세요</button>{open ? <Tooltip id={tooltipId} style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0 }}>툴팁 설명입니다.</Tooltip> : null}</div>;
}
`,
  },
] as const satisfies readonly DocExampleDefinition[];
