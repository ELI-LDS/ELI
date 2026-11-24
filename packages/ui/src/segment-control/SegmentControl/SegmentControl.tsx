'use client';

import './SegmentControl.css';
import type { CSSProperties } from 'react';
import type { SegmentControlProps } from './SegmentControl.types.js';
import { useSegmentControl } from './useSegmentControl.js';

/**
 * 같은 맥락의 옵션 중 하나를 선택해요. 2~4개를 권장해요.
 *
 * @example 빠른 사용
 * `<SegmentControl aria-label="보기 방식" options={options} onValueChange={setValue} />`
 *
 * ### 주요 설정
 * - `options`: `{ value, label }` 형식의 옵션, 2~4개 권장
 * - `value`: 외부에서 제어하는 선택 값
 * - `defaultValue`: 처음 선택할 값, 기본값은 첫 번째 사용 가능 옵션
 *
 * ### 내용과 동작
 * - `options`의 `disabled: true` 항목은 선택과 키보드 이동에서 제외해요.
 * - `disabled`: true이면 전체 선택을 막아요. 기본값은 false예요.
 * - 선택 항목 제거 시 비제어는 첫 사용 가능 항목을 선택하고, 잘못된 제어 값은 선택 표시를 숨겨요.
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
    disabled = false,
    onValueChange,
    options,
    style,
    value,
    ...segmentControlProps
  } = props;
  const { focusableIndex, handleKeyDown, selectedValue, selectValue } =
    useSegmentControl({ disabled, defaultValue, onValueChange, options, value });

  const segmentControlClassName = ['eli-segment-control', className]
    .filter(Boolean)
    .join(' ');
  const selectedIndex = options.findIndex(option => option.value === selectedValue);
  const segmentControlStyle = {
    ...style,
    '--eli-segment-count': options.length,
    '--eli-segment-index': selectedIndex,
  } as CSSProperties;

  return (
    <div
      {...segmentControlProps}
      aria-disabled={disabled || undefined}
      className={segmentControlClassName}
      role="radiogroup"
      style={segmentControlStyle}
    >
      {selectedIndex >= 0 ? (
        <span aria-hidden="true" className="eli-segment-control__indicator" />
      ) : null}
      {options.map((option, index) => {
        const isSelected = option.value === selectedValue;

        return (
          <button
            aria-checked={isSelected}
            className="eli-segment-control__segment eli-typo-label-medium"
            data-selected={isSelected}
            disabled={disabled || option.disabled}
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
