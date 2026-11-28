'use client';

import { DocPreviewCase } from '../../sections/DocPreviewCase';
import { useState } from 'react';
import { TextField } from '../../../../shared/ui/text-field';

export function TextFieldBasicPreview() {
  return (
    <TextField label="이메일" placeholder="이메일을 입력하세요" type="email" />
  );
}

export function TextFieldControlledPreview() {
  const [email, setEmail] = useState("");
  return (
    <TextField label="이메일" placeholder="이메일을 입력하세요" type="email" value={email} onChange={event => setEmail(event.currentTarget.value)} />
  );
}

export function TextFieldStatesPreview() {
  return (
    <div className="docs-demo__stack"><DocPreviewCase fullWidth value="error"><TextField label="오류" state="error" /></DocPreviewCase><DocPreviewCase fullWidth value="success"><TextField label="성공" state="success" /></DocPreviewCase><DocPreviewCase fullWidth value="disabled"><TextField label="비활성화" state="disabled" /></DocPreviewCase></div>
  );
}

