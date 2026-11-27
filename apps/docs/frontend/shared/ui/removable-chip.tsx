'use client';

import './chip/Chip.css';
import { CloseIcon } from './icon/CloseIcon';
import type { RemovableChipProps } from './removable-chip/RemovableChip.types';

/**
 * 추가된 태그나 검색 조건을 표시하고 개별 항목을 제거해요.
 *
 * @example 빠른 사용
 * `<RemovableChip onRemove={() => removeTag()}>프론트엔드</RemovableChip>`
 *
 * ### 주요 설정
 * - `disabled`: `true`이면 라벨과 삭제 버튼을 누를 수 없어요.
 *
 * ### 내용과 동작
 * - `children`: 칩에 표시할 라벨
 * - `onClick`: 라벨 영역을 눌렀을 때 실행할 함수
 * - `onRemove`: X 아이콘을 눌렀을 때 실행할 함수
 * - `removeLabel`: 화면 낭독기가 읽을 삭제 버튼 설명, 기본값은 `삭제`
 *
 * ### 스타일 변경
 * - `className`: 바깥 `span`에 외부 클래스를 전달해요.
 * - `style`: 바깥 `span`의 인라인 스타일을 바꿔요.
 */
export function RemovableChip(props: RemovableChipProps) {
  const {
    children,
    className,
    disabled = false,
    onClick,
    onRemove,
    removeLabel = '삭제',
    ...rootProps
  } = props;

  const chipClassName = ['eli-chip', 'eli-chip--removable', className]
    .filter(Boolean)
    .join(' ');

  const label = <span className="eli-chip__label eli-typo-label-large">{children}</span>;

  return (
    <span {...rootProps} className={chipClassName} data-disabled={disabled}>
      {onClick ? (
        <button
          className="eli-chip__body"
          disabled={disabled}
          onClick={onClick}
          type="button"
        >
          {label}
        </button>
      ) : (
        <span className="eli-chip__body">{label}</span>
      )}

      <button
        aria-label={removeLabel}
        className="eli-chip__icon-button"
        disabled={disabled}
        onClick={event => {
          event.stopPropagation();
          onRemove(event);
        }}
        type="button"
      >
        <CloseIcon />
      </button>
    </span>
  );
}
