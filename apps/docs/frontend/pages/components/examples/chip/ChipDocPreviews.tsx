'use client';

import { useState } from 'react';
import { Chip } from '../../../../shared/ui/chip';
import { RemovableChip } from '../../../../shared/ui/removable-chip';
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
    <div className="docs-demo__row">{visible ? <RemovableChip removeLabel="디자인 삭제" onRemove={() => setVisible(false)}>디자인</RemovableChip> : <button type="button" onClick={() => setVisible(true)}>다시 표시</button>}</div>
  );
}

