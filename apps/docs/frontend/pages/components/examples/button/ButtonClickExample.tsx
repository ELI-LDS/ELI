'use client';

import { useState } from 'react';
import { Button } from '../../../../shared/ui/button';

export function ButtonClickExample() {
  const [saved, setSaved] = useState(false);
  return <Button onClick={() => setSaved(true)}>{saved ? '저장됨' : '저장'}</Button>;
}
