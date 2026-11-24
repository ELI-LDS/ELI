import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

export interface NavigationBarGlassItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'dangerouslySetInnerHTML' | 'aria-label' | 'children'> {
  /** 화면에 표시하지 않고 화면 낭독기에 전달할 라벨이에요. */
  label: string;

  /** 기본 상태에 표시할 outlined 아이콘이에요. */
  outlinedIcon: ReactNode;

  /** 활성 탭에만 표시할 filled 아이콘이에요. */
  filledIcon: ReactNode;

  /** `true`이면 활성 탭으로 표시하고 filled 아이콘을 사용해요. */
  active?: boolean;

  /** NavigationBarGlassItem의 루트 `button`에 전달할 클래스 이름이에요. */
  className?: string;
}
