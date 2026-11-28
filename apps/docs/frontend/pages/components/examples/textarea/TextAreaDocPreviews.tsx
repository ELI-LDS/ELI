'use client';

import { useState } from 'react';
import { TextArea } from '../../../../shared/ui/textarea';

export function TextAreaBasicPreview() {
  return (
    <TextArea label="소개" placeholder="소개를 입력하세요" />
  );
}

export function TextAreaControlledPreview() {
  const [message, setMessage] = useState("");
  return (
    <TextArea label="소개" placeholder="소개를 입력하세요" value={message} onChange={event => setMessage(event.currentTarget.value)} />
  );
}

export function TextAreaDisabledPreview() {
  return (
    <TextArea label="소개" placeholder="소개를 입력하세요" disabled />
  );
}

