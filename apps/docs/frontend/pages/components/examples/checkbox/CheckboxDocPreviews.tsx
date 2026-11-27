'use client';

import { useState } from 'react';
import { Checkbox } from '../../../../shared/ui/checkbox';

export function CheckboxBasicPreview() {
  return (
    <label className="docs-demo__row"><Checkbox />이용약관에 동의해요.</label>
  );
}

export function CheckboxControlledPreview() {
  const [agreed, setAgreed] = useState(false);
  return (
    <label className="docs-demo__row"><Checkbox checked={agreed} onChange={event => setAgreed(event.currentTarget.checked)} />이용약관에 동의해요.</label>
  );
}

export function CheckboxDisabledPreview() {
  return (
    <Checkbox aria-label="변경할 수 없는 항목" defaultChecked disabled />
  );
}

