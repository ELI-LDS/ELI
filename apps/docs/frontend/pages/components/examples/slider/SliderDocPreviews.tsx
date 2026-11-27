'use client';

import { DocPreviewCase } from '../../sections/DocPreviewCase';
import { useState } from 'react';
import { Slider } from '../../../../shared/ui/slider';
import './SliderDocPreviews.css';

export function SliderBasicPreview() {
  return (
    <div className="docs-slider-preview"><Slider aria-label="볼륨" defaultValue={50} /></div>
  );
}

export function SliderRangePreview() {
  return (
    <div className="docs-slider-preview"><DocPreviewCase fullWidth value="range"><Slider aria-label="가격 범위" variant="range" defaultValue={[25, 60]} /></DocPreviewCase></div>
  );
}

export function SliderControlledPreview() {
  const [volume, setVolume] = useState(50);
  return (
    <div className="docs-slider-preview"><Slider aria-label="볼륨" value={volume} onValueChange={setVolume} min={0} max={100} step={5} /></div>
  );
}

