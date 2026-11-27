'use client';

import { useState } from 'react';
import { SnackBar } from '../../../../shared/ui/snack-bar';
import { Button } from '../../../../shared/ui/button';

export function SnackBarBasicPreview() {
  return (
    <SnackBar duration={0} action="확인">저장했어요.</SnackBar>
  );
}

export function SnackBarOpenPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="docs-demo__stack"><Button icon={null} onClick={() => setOpen(true)}>스낵바 띄우기</Button><SnackBar open={open} onOpenChange={setOpen} duration={5000} action="닫기" onAction={() => setOpen(false)}>저장했어요.</SnackBar></div>
  );
}

