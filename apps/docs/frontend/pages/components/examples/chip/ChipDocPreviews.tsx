'use client';

import { useState } from 'react';
import { Chip } from '../../../../shared/ui/chip';
import { DocPreviewCase } from '../../sections/DocPreviewCase';
import { FilterExample } from './filter/FilterExample';

export function ChipBasicPreview() {
  const [selected, setSelected] = useState(false);
  return (
    <Chip selected={selected} onSelectedChange={setSelected}>디자인</Chip>
  );
}

export function ChipMultiplePreview() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div className="docs-demo__row">{["디자인", "개발", "기획"].map(label => <Chip key={label} selected={selected.includes(label)} onSelectedChange={next => setSelected(previous => next ? [...previous, label] : previous.filter(value => value !== label))}>{label}</Chip>)}</div>
  );
}

export function ChipFilterPreview() {
  return (
    <FilterExample />
  );
}

export function ChipRemovePreview() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="docs-demo__row">{visible ? <Chip variant="removable" removeLabel="디자인 삭제" onRemove={() => setVisible(false)}>디자인</Chip> : <button type="button" onClick={() => setVisible(true)}>다시 표시</button>}</div>
  );
}


export function ChipVariantsPreview() {
  const [selected, setSelected] = useState(false);
  return <>
    <DocPreviewCase value="selectable"><Chip variant="selectable" selected={selected} onSelectedChange={setSelected}>디자인</Chip></DocPreviewCase>
    <DocPreviewCase value="filter"><Chip variant="filter" label="분야" options={[]} /></DocPreviewCase>
    <DocPreviewCase value="removable"><Chip variant="removable" onRemove={() => undefined}>디자인</Chip></DocPreviewCase>
  </>;
}
