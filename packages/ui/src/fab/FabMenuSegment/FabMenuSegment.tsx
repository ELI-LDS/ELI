'use client';

import './FabMenuSegment.css';
import { PlusIcon } from '../../icon/PlusIcon.js';
import type { FabMenuSegmentProps } from './FabMenuSegment.types.js';

/**
 * 펼쳐진 FAB Menu에서 하나의 액션을 실행하는 버튼이에요.
 *
 * @example 빠른 사용
 * `<FabMenuSegment label="사진 추가" onClick={addPhoto} />`
 *
 * ### 내용과 동작
 * - `label`: 액션을 설명하는 한 줄 라벨이에요.
 * - `icon`: 기본 Add 아이콘을 다른 아이콘으로 바꿔요.
 * - `onClick`: Segment를 눌렀을 때 액션을 실행해요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `button`에 외부 클래스를 전달해요.
 * - `style`: 루트 `button`의 인라인 스타일을 바꿔요.
 */
export function FabMenuSegment(props: FabMenuSegmentProps) {
  const {
    className,
    icon,
    label,
    type = 'button',
    ...buttonProps
  } = props;
  const visibleIcon = icon === undefined ? <PlusIcon size={24} /> : icon;
  const segmentClassName = ['eli-fab-menu-segment', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button {...buttonProps} className={segmentClassName} type={type}>
      {visibleIcon !== null && (
        <span aria-hidden="true" className="eli-fab-menu-segment__icon">
          {visibleIcon}
        </span>
      )}
      <span className="eli-fab-menu-segment__label eli-typo-label-large">
        {label}
      </span>
    </button>
  );
}
