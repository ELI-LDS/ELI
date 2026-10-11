import './IconButton.css';
import { PlusIcon } from '../../icon/PlusIcon.js';
import type { IconButtonProps } from './IconButton.types.js';

/* Icon Button */
export function IconButton({
  /* Content */
  icon = <PlusIcon />,

  /* Style Options */
  color = 'brand',
  size = 'large',
  variant = 'solid',

  /* Native Button */
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  /* Class Name */
  const iconButtonClassName = ['eli-icon-button', className].filter(Boolean).join(' ');

  return (
    /* Root */
    <button
      {...props}
      className={iconButtonClassName}
      data-color={color}
      data-size={size}
      data-variant={variant}
      type={type}
    >
      {/* Icon */}
      <span className="eli-icon-button__icon">{icon}</span>
    </button>
  );
}
