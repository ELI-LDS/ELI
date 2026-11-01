'use client';

import './Slider.css';
import type {
  SliderProps,
  SliderRangeProps,
  SliderStandardProps,
} from './Slider.types.js';
import { useSlider } from './useSlider.js';

/* 현재 값을 트랙 위의 위치로 바꿔요. */
function getPercentage(value: number, min: number, max: number) {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
}

/* Handle 위에 현재 값과 말풍선 화살표를 표시해요. */
function ValueIndicator({ percentage, value }: { percentage: number; value: number }) {
  return (
    <span
      aria-hidden="true"
      className="eli-slider__value-indicator"
      style={{ left: `${percentage}%` }}
    >
      <span>{value}</span>
      <span className="eli-slider__value-indicator-arrow" />
    </span>
  );
}

/* Slider 양 끝에 최솟값과 최댓값을 표시해요. */
function Markers({ max, min }: { max: number; min: number }) {
  return (
    <div aria-hidden="true" className="eli-slider__markers">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  );
}

/* 하나의 값을 선택하는 기본 Slider예요. */
function StandardSlider(props: SliderStandardProps) {
  const {
    'aria-label': ariaLabel,
    className,
    defaultValue,
    disabled = false,
    max: maximum,
    min: minimum,
    onValueChange,
    showMarker = true,
    showValueIndicator = true,
    step = 1,
    value,
    variant = 'standard',
    ...sliderProps
  } = props;
  const { max, min, setStandardValue, standardValue } = useSlider({
    defaultValue,
    max: maximum,
    min: minimum,
    onValueChange,
    value,
    variant: 'standard',
  });
  const percentage = getPercentage(standardValue, min, max);
  const sliderClassName = ['eli-slider', className].filter(Boolean).join(' ');

  return (
    <div
      {...sliderProps}
      className={sliderClassName}
      data-disabled={disabled}
      data-variant={variant}
    >
      <div className="eli-slider__track">
        <span
          aria-hidden="true"
          className="eli-slider__active-track"
          style={{ right: `${100 - percentage}%` }}
        />
        {showValueIndicator && (
          <ValueIndicator percentage={percentage} value={standardValue} />
        )}
        <input
          aria-label={ariaLabel}
          className="eli-slider__input"
          disabled={disabled}
          max={max}
          min={min}
          onChange={event => setStandardValue(event.currentTarget.valueAsNumber)}
          step={step}
          type="range"
          value={standardValue}
        />
      </div>
      {showMarker && <Markers max={max} min={min} />}
    </div>
  );
}

/* 시작 값과 끝 값으로 구간을 선택하는 Range Slider예요. */
function RangeSlider(props: SliderRangeProps) {
  const {
    'aria-label': ariaLabel,
    className,
    defaultValue,
    disabled = false,
    max: maximum,
    min: minimum,
    onValueChange,
    showLeftValueIndicator = true,
    showMarker = true,
    showRightValueIndicator = true,
    step = 1,
    value,
    variant,
    ...sliderProps
  } = props;
  const { max, min, rangeValue, setRangeValue } = useSlider({
    defaultValue,
    max: maximum,
    min: minimum,
    onValueChange,
    value,
    variant: 'range',
  });
  const startPercentage = getPercentage(rangeValue[0], min, max);
  const endPercentage = getPercentage(rangeValue[1], min, max);
  const sliderClassName = ['eli-slider', className].filter(Boolean).join(' ');

  return (
    <div
      {...sliderProps}
      aria-label={ariaLabel}
      className={sliderClassName}
      data-disabled={disabled}
      data-variant={variant}
      role="group"
    >
      <div className="eli-slider__track">
        {/* 두 Handle 사이만 활성 트랙으로 표시해요. */}
        <span
          aria-hidden="true"
          className="eli-slider__active-track"
          style={{ left: `${startPercentage}%`, right: `${100 - endPercentage}%` }}
        />
        {showLeftValueIndicator && (
          <ValueIndicator percentage={startPercentage} value={rangeValue[0]} />
        )}
        {showRightValueIndicator && (
          <ValueIndicator percentage={endPercentage} value={rangeValue[1]} />
        )}
        {/* 두 input은 각 Handle의 키보드 조작과 접근성 정보를 맡아요. */}
        <input
          aria-label={`${ariaLabel} 시작 값`}
          className="eli-slider__input eli-slider__input--start"
          disabled={disabled}
          max={max}
          min={min}
          onChange={event => setRangeValue(0, event.currentTarget.valueAsNumber)}
          step={step}
          type="range"
          value={rangeValue[0]}
        />
        <input
          aria-label={`${ariaLabel} 끝 값`}
          className="eli-slider__input eli-slider__input--end"
          disabled={disabled}
          max={max}
          min={min}
          onChange={event => setRangeValue(1, event.currentTarget.valueAsNumber)}
          step={step}
          type="range"
          value={rangeValue[1]}
        />
      </div>
      {showMarker && <Markers max={max} min={min} />}
    </div>
  );
}

/**
 * 하나의 값이나 시작·끝 범위를 Slider로 선택해요.
 *
 * @example 빠른 사용
 * `<Slider aria-label="볼륨" onValueChange={setVolume} />`
 *
 * ### 주요 설정
 * - `variant`: `standard | range`, 기본값은 `standard`
 * - `min`·`max`: 조절 범위, 기본값은 `0`과 `100`
 * - `step`: 한 번에 이동할 간격, 기본값은 `1`
 *
 * ### 선택 가이드
 * - `standard`: 볼륨처럼 하나의 값을 선택할 때 사용해요.
 * - `range`: 가격대처럼 시작 값과 끝 값을 함께 선택할 때 사용해요.
 *
 * ### 내용과 동작
 * - `onValueChange`: Standard는 숫자, Range는 `[시작 값, 끝 값]`을 받아요.
 * - Handle을 드래그하거나 방향키·Page Up·Page Down·Home·End로 값을 바꿔요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `div`에 외부 클래스를 전달해요.
 * - `style`: 루트 `div`의 인라인 스타일을 바꿔요.
 */
export function Slider(props: SliderProps) {
  /* variant에 맞는 값 타입과 화면 구조를 선택해요. */
  if (props.variant === 'range') return <RangeSlider {...props} />;
  return <StandardSlider {...props} />;
}
