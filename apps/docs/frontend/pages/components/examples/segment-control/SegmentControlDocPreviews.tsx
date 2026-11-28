'use client';

import { useState } from 'react';
import { SegmentControl } from '../../../../shared/ui/segment-control';

export function SegmentControlBasicPreview() {
  return (
    <SegmentControl aria-label="보기 방식" options={[{ value: "list", label: "목록" }, { value: "grid", label: "격자" }]} />
  );
}

export function SegmentControlControlledPreview() {
  const [view, setView] = useState("list");
  return (
    <SegmentControl aria-label="보기 방식" options={[{ value: "list", label: "목록" }, { value: "grid", label: "격자" }]} value={view} onValueChange={setView} />
  );
}

export function SegmentControlDisabledPreview() {
  return (
    <SegmentControl aria-label="변경할 수 없는 보기 방식" options={[{ value: "list", label: "목록" }, { value: "grid", label: "격자" }]} disabled />
  );
}

