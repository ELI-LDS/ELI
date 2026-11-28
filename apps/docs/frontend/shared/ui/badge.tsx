import './badge/Badge.css';
import type { BadgeProps } from './badge/Badge.types';

/* Size별 타이포그래피 */
const typographyClassNames = {
  large: 'eli-typo-label-large',
  medium: 'eli-typo-label-medium',
} as const;

/**
 * 짧은 상태나 분류를 작은 라벨로 표시해요.
 *
 * @example 빠른 사용
 * `<Badge size="medium" type="success">완료</Badge>`
 *
 * ### 주요 설정
 * - `size`: `medium`(기본값), `large`
 * - `type`: `neutral`(기본값), `error`, `success`, `caution`
 *
 * ### 선택 가이드
 * - `neutral`: 일반적인 상태나 분류
 * - `error`, `success`, `caution`: 오류·성공·주의 결과
 *
 * ### 내용과 동작
 * - `children`: 배지에 표시할 내용
 *
 * ### 스타일 변경
 * - `className`: 루트 `span`에 외부 클래스를 전달해요.
 * - `style`: 루트 `span`의 인라인 스타일을 바꿔요.
 */
export function Badge(props: BadgeProps) {
  const {
    children,
    size = 'medium',
    type = 'neutral',
    className,
    ...badgeProps
  } = props;

  const badgeClassName = ['eli-badge', typographyClassNames[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span {...badgeProps} className={badgeClassName} data-size={size} data-type={type}>
      {children}
    </span>
  );
}
