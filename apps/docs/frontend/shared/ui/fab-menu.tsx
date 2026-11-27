'use client';

import { useId } from 'react';
import './fab-menu/FabMenu.css';
import './fab-menu/FabMenu.interaction.css';
import { Fab } from './fab';
import { FabMenuSegment } from './fab-menu-segment';
import type { FabMenuProps } from './fab-menu/FabMenu.types';
import { useFabMenu } from './fab-menu/useFabMenu';

/**
 * 메인 FAB를 눌러 여러 개의 개별 액션을 열고 닫아요.
 *
 * @example 빠른 사용
 * `<FabMenu items={[{ id: 'photo', label: '사진 추가', onClick: addPhoto }]} label="추가" />`
 *
 * ### 주요 설정
 * - `items`: 아이콘·라벨·실행 함수를 가진 액션 목록이에요.
 * - `expanded`, `defaultExpanded`: 제어·비제어 메뉴 열림 상태예요.
 * - `showLabel`: 닫힌 메인 FAB의 라벨 표시 여부예요. 기본값은 `true`예요.
 *
 * ### 선택 가이드
 * - 하나의 액션만 필요하면 `Fab`을 단독으로 사용해요.
 * - 관련된 여러 액션을 한 자리에서 펼쳐야 할 때 `FabMenu`를 사용해요.
 * - `items`는 한 개 이상 전달해요. 항목이 많아지면 디자이너와 최대 개수와 대체 화면을 먼저 확인해요.
 *
 * ### 내용과 동작
 * - 메인 FAB를 누르면 메뉴가 열리거나 닫혀요.
 * - 메뉴 전체가 한 번에 페이드되며 아래에서 올라와요. 닫힐 때는 더 짧고 빠르게 사라져요.
 * - 개별 항목을 누르면 `onClick`을 실행한 뒤 메뉴를 닫아요.
 * - `onExpandedChange`: 열림 상태가 바뀔 때 다음 상태를 전달해요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `div`에 외부 클래스를 전달해요.
 * - `style`: 루트 `div`의 인라인 스타일을 바꿔요.
 */
export function FabMenu(props: FabMenuProps) {
  const {
    className,
    defaultExpanded = false,
    expanded,
    expandedIcon,
    icon,
    items,
    label = '버튼',
    onExpandedChange,
    showLabel = true,
    ...divProps
  } = props;
  const menuId = useId();
  const { closeMenu, isExpanded, toggleExpanded } = useFabMenu({
    defaultExpanded,
    expanded,
    onExpandedChange,
  });
  const menuClassName = ['eli-fab-menu', className].filter(Boolean).join(' ');

  return (
    <div {...divProps} className={menuClassName} data-expanded={isExpanded}>
      {/* 닫혀도 DOM에 남겨두고 CSS로 숨겨요. 그래야 닫히는 모션이 보여요. */}
      <div
        aria-hidden={!isExpanded}
        aria-label={`${label} 메뉴`}
        className="eli-fab-menu__items"
        id={menuId}
        inert={!isExpanded}
        role="group"
      >
        {items.map(item => (
          <FabMenuSegment
            disabled={item.disabled}
            icon={item.icon}
            key={item.id}
            label={item.label}
            onClick={event => {
              item.onClick?.(event);
              closeMenu();
            }}
          />
        ))}
      </div>

      <Fab
        aria-controls={menuId}
        expanded={isExpanded}
        expandedIcon={expandedIcon}
        icon={icon}
        label={label}
        onClick={toggleExpanded}
        showLabel={showLabel}
      />
    </div>
  );
}
