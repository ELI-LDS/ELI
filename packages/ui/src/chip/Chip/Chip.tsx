'use client';

import '../Chip.css';
import { FilterChip } from '../FilterChip/FilterChip.js';
import { RemovableChip } from '../RemovableChip/RemovableChip.js';
import type { ChipProps, SelectableChipProps } from './Chip.types.js';

/**
 * 항목 선택·필터 설정·태그 삭제를 `variant`로 골라 사용해요.
 *
 * @example 빠른 사용
 * `<Chip selected={selected} onSelectedChange={setSelected}>장르</Chip>`
 * `<Chip variant="filter" label="컬러" options={options} onClick={openFilter} />`
 * `<Chip variant="removable" onRemove={removeTag}>디자인</Chip>`
 *
 * ### 주요 설정
 * - `variant`: `selectable` | `filter` | `removable`, 기본값은 `selectable`
 * - `disabled`: `true`이면 해당 variant의 버튼을 누를 수 없어요.
 *
 * ### 선택 가이드
 * - 단순 선택은 `selectable`, 별도 필터 화면 열기는 `filter`, 태그 삭제는 `removable`을 사용해요.
 *
 * ### 내용과 동작
 * - 선택형은 `children`·`selected`·`onSelectedChange`를 연결해요.
 * - 필터형은 `label`·`options`·`selectedValues`·`onClick`을 연결해요.
 * - 삭제형은 `children`·필수 `onRemove`를 연결하고 `removeLabel`로 삭제 대상을 설명해요.
 *
 * ### 스타일 변경
 * - `className`·`style`은 선택·필터형의 루트 `button`, 삭제형의 바깥 `span`에 적용돼요.
 */
export function Chip(props: ChipProps) {
  // variant를 DOM에 전달하지 않고 기존 역할별 마크업과 이벤트 대상을 유지해요.
  if (props.variant === 'filter') {
    const { variant: _variant, ...filterProps } = props;
    void _variant;
    return <FilterChip {...filterProps} />;
  }
  if (props.variant === 'removable') {
    const { variant: _variant, ...removableProps } = props;
    void _variant;
    return <RemovableChip {...removableProps} />;
  }
  const { variant: _variant, ...selectableProps } = props;
  void _variant;
  return <SelectableChip {...selectableProps} />;
}

function SelectableChip(props: SelectableChipProps) {
  const {
    children,
    className,
    onClick,
    onSelectedChange,
    selected = false,
    type = 'button',
    ...buttonProps
  } = props;

  const chipClassName = ['eli-chip', className].filter(Boolean).join(' ');

  return (
    <button
      {...buttonProps}
      aria-pressed={selected}
      className={chipClassName}
      data-selected={selected}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) onSelectedChange?.(!selected);
      }}
      type={type}
    >
      <span className="eli-chip__label eli-typo-label-large">{children}</span>
    </button>
  );
}
