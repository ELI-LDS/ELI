'use client';

import { useId, useState } from 'react';
import { Radio } from '../../../../shared/ui/radio';

export function RadioBasicPreview() {
  return (
    <div className="docs-demo__row"><label className="docs-demo__row"><Radio name="basic-topic" value="design" defaultChecked />디자인</label><label className="docs-demo__row"><Radio name="basic-topic" value="development" />개발</label></div>
  );
}

export function RadioControlledPreview() {
  const name = useId();
  const [selected, setSelected] = useState("디자인");
  return (
    <div className="docs-demo__row">{["디자인", "개발"].map(value => <label className="docs-demo__row" key={value}><Radio name={name} value={value} checked={selected === value} onChange={event => setSelected(event.currentTarget.value)} />{value}</label>)}</div>
  );
}

