'use client';

import { useState } from 'react';
import { Toggle } from '../../../../shared/ui/toggle';

export function ToggleBasicPreview() {
  return (
    <Toggle aria-label="알림 받기" />
  );
}

export function ToggleControlledPreview() {
  const [enabled, setEnabled] = useState(false);
  return (
    <Toggle aria-label="알림 받기" checked={enabled} onCheckedChange={setEnabled} />
  );
}

export function ToggleDisabledPreview() {
  return (
    <Toggle aria-label="알림 받기" defaultChecked disabled />
  );
}

