import { useState } from 'react';
import type {
  SliderRangeProps,
  SliderRangeValue,
  SliderStandardProps,
} from './Slider.types.js';

type UseSliderOptions = {
  max: number | undefined;
  min: number | undefined;
  step: number | undefined;
} & (
  | { [K in 'defaultValue' | 'onValueChange' | 'value']-?: SliderStandardProps[K] } & { variant: 'standard' }
  | { [K in 'defaultValue' | 'onValueChange' | 'value']-?: SliderRangeProps[K] } & { variant: 'range' }
);

type SliderValue = number | SliderRangeValue;

/* 네이티브 range와 표시 값에 같은 간격을 적용해 서로 다른 값이 보이지 않게 해요. */
export function useSlider(options: UseSliderOptions) {
  const lower = typeof options.min === 'number' && Number.isFinite(options.min) ? options.min : 0;
  const upper = typeof options.max === 'number' && Number.isFinite(options.max) ? options.max : 100;
  const min = Math.min(lower, upper);
  const max = Math.max(lower, upper);
  const step = options.step !== undefined && Number.isFinite(options.step) && options.step > 0
    ? options.step : 1;

  const normalize = (value: number) => {
    const clamped = Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);
    const tickLimit = (max - min) / step;
    // 소수 간격 계산 오차로 마지막 유효 눈금이 빠지지 않도록 허용 오차를 적용해요.
    const maxTicks = Math.floor(tickLimit + Number.EPSILON * Math.max(1, tickLimit) * 4);
    const tick = (clamped - min) / step;
    const tolerance = Number.EPSILON * Math.max(1, tick) * 4;
    const ticks = Math.min(Math.round(tick + tolerance), maxTicks);
    return Math.min(max, Math.max(min, Number((min + ticks * step).toPrecision(15))));
  };
  const normalizeRange = (range: SliderRangeValue): SliderRangeValue => {
    const first = normalize(range[0]);
    const second = normalize(range[1]);
    return [Math.min(first, second), Math.max(first, second)];
  };
  const defaultStandardValue = normalize(min + (max - min) * 0.6);
  const defaultRangeValue: SliderRangeValue = normalizeRange([
    min + (max - min) * 0.27,
    min + (max - min) * 0.6,
  ]);

  const [internalValue, setInternalValue] = useState<SliderValue>(() =>
    options.variant === 'range'
      ? normalizeRange(options.defaultValue ?? defaultRangeValue)
      : normalize(options.defaultValue ?? defaultStandardValue),
  );
  const resolvedValue = options.value ?? internalValue;
  const standardValue = typeof resolvedValue === 'number'
    ? normalize(resolvedValue) : defaultStandardValue;
  const rangeValue = Array.isArray(resolvedValue)
    ? normalizeRange(resolvedValue as SliderRangeValue) : defaultRangeValue;

  const setStandardValue = (nextValue: number) => {
    if (options.variant !== 'standard') return;
    const next = normalize(nextValue);
    if (options.value === undefined) setInternalValue(next);
    options.onValueChange?.(next);
  };

  /* 두 Handle이 교차하지 않도록 정규화한 값으로 범위를 제한해요. */
  const setRangeValue = (index: 0 | 1, nextValue: number) => {
    if (options.variant !== 'range') return;
    const normalized = normalize(nextValue);
    const next: SliderRangeValue = index === 0
      ? [Math.min(normalized, rangeValue[1]), rangeValue[1]]
      : [rangeValue[0], Math.max(normalized, rangeValue[0])];
    if (options.value === undefined) setInternalValue(next);
    options.onValueChange?.(next);
  };

  return { max, min, step, rangeValue, setRangeValue, setStandardValue, standardValue };
}
