'use client';

import './SegmentControl.css';
import type { CSSProperties } from 'react';
import type { SegmentControlProps } from './SegmentControl.types.js';
import { useSegmentControl } from './useSegmentControl.js';

/**
 * 2개부터 4개의 옵션 중 하나를 선택해요.
 *
 * @example 빠른 사용
 * `<SegmentControl aria-label="보기 방식" options={options} onValueChange={setValue} />`
 *
 * ### 주요 설정
 * - `options`: `{ value, label }` 형식의 옵션 2~4개
 * - `value`: 외부에서 제어하는 선택 값
 * - `defaultValue`: 처음 선택할 값, 기본값은 첫 번째 옵션
 *
 * ### 내용과 동작
 * - `onValueChange`: 선택한 옵션의 `value`를 받아요.
 * - 방향키·Home·End로 옵션을 이동할 수 있어요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `div`에 외부 클래스를 전달해요.
 * - `style`: 루트 `div`의 인라인 스타일을 바꿔요.
 */
export function SegmentControl(props: SegmentControlProps) {
  const {
    className,
    defaultValue,
    onValueChange,
    options,
    style,
    value,
    ...segmentControlProps
  } = props;
  const { focusableIndex, handleKeyDown, selectedValue, selectValue } =
    useSegmentControl({ defaultValue, onValueChange, options, value });

  const segmentControlClassName = ['eli-segment-control', className]
    .filter(Boolean)
    .join(' ');
  const selectedIndex = Math.max(
    options.findIndex(option => option.value === selectedValue),
    0,
  );
  const segmentControlStyle = {
    ...style,
    '--eli-segment-count': options.length,
    '--eli-segment-index': selectedIndex,
  } as CSSProperties;

  return (
    <div
      {...segmentControlProps}
      className={segmentControlClassName}
      role="radiogroup"
      style={segmentControlStyle}
    >
      {options.length > 0 ? (
        <span aria-hidden="true" className="eli-segment-control__indicator" />
      ) : null}
      {options.map((option, index) => {
        const isSelected = option.value === selectedValue;

        return (
          <button
            aria-checked={isSelected}
            className="eli-segment-control__segment eli-typo-label-medium"
            data-selected={isSelected}
            key={option.value}
            onClick={() => selectValue(option.value)}
            onKeyDown={event => handleKeyDown(event, index)}
            role="radio"
            tabIndex={index === focusableIndex ? 0 : -1}
            type="button"
          >
            <span className="eli-segment-control__label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
