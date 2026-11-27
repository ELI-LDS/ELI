'use client';

import { useId, useState } from 'react';
import { Tooltip } from '../../../../shared/ui/tooltip';
import './TooltipExample.css';

export function TooltipExample() {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  return <div className="docs-demo__tooltip"><button aria-describedby={open ? tooltipId : undefined} className="eli-typo-body-medium" onBlur={() => setOpen(false)} onFocus={() => setOpen(true)} onKeyDown={event => {
    if (event.key === 'Escape')
      setOpen(false);
  }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} type="button">마우스를 올려보세요</button>{open ? <Tooltip id={tooltipId}>툴팁 설명입니다.</Tooltip> : null}</div>;
}
