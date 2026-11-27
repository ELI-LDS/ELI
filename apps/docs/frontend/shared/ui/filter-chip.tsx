'use client';

import './chip/Chip.css';
import { ExpandMoreIcon } from './icon/ExpandMoreIcon';
import type { FilterChipProps } from './filter-chip/FilterChip.types';

/**
 * 필터를 설정하는 바텀시트나 모달을 여는 진입점이에요.
 *
 * @example 빠른 사용
 * `<FilterChip label="컬러" options={options} selectedValues={values} onClick={openFilter} />`
 *
 * ### 주요 설정
 * - `options`: 화면에 정의된 순서의 전체 옵션
 * - `selectedValues`: 적용한 옵션 값, 기본값은 빈 배열
 * - `disabled`: `true`이면 필터 화면을 열 수 없어요.
 *
 * ### 내용과 동작
 * - `label`: 선택값이 없을 때 표시할 필터 항목명
 * - `onClick`: 바텀시트나 모달을 여는 함수
 * - 선택값이 여러 개면 옵션 순서상 첫 값과 `외 N`을 표시해요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `button`에 외부 클래스를 전달해요.
 * - `style`: 루트 `button`의 인라인 스타일을 바꿔요.
 */
export function FilterChip(props: FilterChipProps) {
  const {
    className,
    label,
    options,
    selectedValues = [],
    type = 'button',
    ...buttonProps
  } = props;

  const selectedValueSet = new Set(selectedValues);
  const selectedOptions = options.filter(option => selectedValueSet.has(option.value));
  const firstSelectedOption = selectedOptions[0];
  const selectedCount = selectedOptions.length;
  const selected = selectedCount > 0;
  const visibleLabel = firstSelectedOption?.label ?? label;
  const additionalCount = selectedCount - 1;
  const chipClassName = ['eli-chip', 'eli-chip--filter', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...buttonProps}
      aria-pressed={selected}
      className={chipClassName}
      data-selected={selected}
      type={type}
    >
      <span className="eli-chip__label eli-typo-label-large">{visibleLabel}</span>
      {additionalCount > 0 ? (
        <span className="eli-chip__count eli-typo-label-large">외 {additionalCount}</span>
      ) : null}
      <span className="eli-chip__icon">
        <ExpandMoreIcon />
      </span>
    </button>
  );
}
