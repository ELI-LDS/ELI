import { useState } from 'react';
import type {
  SliderRangeProps,
  SliderRangeValue,
  SliderStandardProps,
} from './Slider.types.js';

type UseSliderOptions =
  | {
      defaultValue: SliderStandardProps['defaultValue'];
      max: number | undefined;
      min: number | undefined;
      onValueChange: SliderStandardProps['onValueChange'];
      value: SliderStandardProps['value'];
      variant: 'standard';
    }
  | {
      defaultValue: SliderRangeProps['defaultValue'];
      max: number | undefined;
      min: number | undefined;
      onValueChange: SliderRangeProps['onValueChange'];
      value: SliderRangeProps['value'];
      variant: 'range';
    };

type SliderValue = number | SliderRangeValue;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function valueAtPercentage(min: number, max: number, percentage: number) {
  return min + (max - min) * percentage;
}

function normalizeRange(value: SliderRangeValue, min: number, max: number): SliderRangeValue {
  const start = clamp(Math.min(value[0], value[1]), min, max);
  const end = clamp(Math.max(value[0], value[1]), min, max);
  return [start, end];
}

/* Slider의 제어·비제어 값과 Range Handle의 교차 방지를 관리해요. */
export function useSlider(options: UseSliderOptions) {
  const min = Math.min(options.min ?? 0, options.max ?? 100);
  const max = Math.max(options.min ?? 0, options.max ?? 100);
  const defaultStandardValue = valueAtPercentage(min, max, 0.6);
  const defaultRangeValue: SliderRangeValue = [
    valueAtPercentage(min, max, 0.27),
    valueAtPercentage(min, max, 0.6),
  ];

  /* value가 없을 때 사용하는 내부 값을 형태에 맞게 준비해요. */
  const [internalValue, setInternalValue] = useState<SliderValue>(() => {
    if (options.variant === 'range') {
      return normalizeRange(options.defaultValue ?? defaultRangeValue, min, max);
    }
    return clamp(options.defaultValue ?? defaultStandardValue, min, max);
  });

  const controlledValue = options.value;
  const resolvedValue = controlledValue ?? internalValue;
  const standardValue = typeof resolvedValue === 'number'
    ? clamp(resolvedValue, min, max)
    : defaultStandardValue;
  const rangeValue = Array.isArray(resolvedValue)
    ? normalizeRange(resolvedValue as SliderRangeValue, min, max)
    : defaultRangeValue;

  /* Standard 값을 갱신하고 제어 중이면 부모에만 다음 값을 알려줘요. */
  const setStandardValue = (nextValue: number) => {
    if (options.variant === 'range') return;
    const normalizedValue = clamp(nextValue, min, max);
    if (options.value === undefined) setInternalValue(normalizedValue);
    options.onValueChange?.(normalizedValue);
  };

  /* 두 Handle이 서로 지나가지 않도록 시작 값과 끝 값의 순서를 유지해요. */
  const setRangeValue = (index: 0 | 1, nextValue: number) => {
    if (options.variant !== 'range') return;
    const normalizedValue = clamp(nextValue, min, max);
    const nextRange: SliderRangeValue = index === 0
      ? [Math.min(normalizedValue, rangeValue[1]), rangeValue[1]]
      : [rangeValue[0], Math.max(normalizedValue, rangeValue[0])];
    if (options.value === undefined) setInternalValue(nextRange);
    options.onValueChange?.(nextRange);
  };

  return { max, min, rangeValue, setRangeValue, setStandardValue, standardValue };
}
