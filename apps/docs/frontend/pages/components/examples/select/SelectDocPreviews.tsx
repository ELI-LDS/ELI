'use client';

import { useState } from 'react';
import { Select } from '../../../../shared/ui/select';

export function SelectBasicPreview() {
  return (
    <Select label="분류" placeholder="분류를 선택하세요" options={[{ value: "design", label: "디자인" }, { value: "development", label: "개발" }]} />
  );
}

export function SelectControlledPreview() {
  const [value, setValue] = useState("");
  return (
    <Select label="분류" placeholder="분류를 선택하세요" options={[{ value: "design", label: "디자인" }, { value: "development", label: "개발" }]} value={value} onValueChange={setValue} />
  );
}

export function SelectDisabledPreview() {
  return (
    <Select label="분류" options={[{ value: "design", label: "디자인" }, { value: "development", label: "개발" }]} disabled />
  );
}

