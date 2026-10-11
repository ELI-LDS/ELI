import './Badge.css';
import type { BadgeProps } from './Badge.types.js';

/* Size별 타이포그래피 */
const typographyClassNames = {
  large: 'eli-typo-label-large',
  medium: 'eli-typo-label-medium',
} as const;

/* Badge */
export function Badge({
  /* Content */
  children,

  /* Style Options */
  size = 'large',

  /* Native Element */
  className,
  ...props
}: BadgeProps) {
  /* Class Name */
  const badgeClassName = ['eli-badge', typographyClassNames[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span {...props} className={badgeClassName} data-size={size}>
      {children}
    </span>
  );
}
