import './navigation-drawer-category/NavigationDrawerCategory.css';
import type { NavigationDrawerCategoryProps } from './navigation-drawer-category/NavigationDrawerCategory.types';

/**
 * Navigation Drawer 안에서 여러 메뉴를 구분하는 카테고리 이름을 표시해요.
 *
 * @example 빠른 사용
 * `<NavigationDrawerCategory label="학습" />`
 *
 * ### 주요 설정
 * - `label`: 표시할 카테고리 이름, 기본값은 `카테고리`
 *
 * ### 선택 가이드
 * - 서로 다른 메뉴 묶음의 시작을 알려야 할 때 사용해요.
 * - 이동하거나 열고 닫는 항목에는 `NavigationDrawerMenu`를 사용해요.
 *
 * ### 내용과 동작
 * - 클릭 동작이 없는 제목 행이에요.
 * - 하나의 Drawer 안에 필요한 만큼 반복해서 배치할 수 있어요.
 *
 * ### 스타일 변경
 * - `className`: 루트 `div`에 외부 클래스를 전달해요.
 * - `style`: 루트 `div`의 인라인 스타일을 바꿔요.
 */
export function NavigationDrawerCategory({
  className,
  label = '카테고리',
  ...rootProps
}: NavigationDrawerCategoryProps) {
  const categoryClassName = [
    'eli-navigation-drawer-category',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...rootProps} className={categoryClassName}>
      <span className="eli-navigation-drawer-category__label eli-typo-label-large">
        {label}
      </span>
    </div>
  );
}
