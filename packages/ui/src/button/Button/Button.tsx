import './Button.css';
import { PlusIcon } from '../../icon/PlusIcon.js';
import type { CSSProperties } from 'react';
import type { ButtonProps } from './Button.types.js';

/* Button */
export function Button({
  /* Content */
  children = '버튼',
  icon = <PlusIcon />,

  /* Style Options */
  backgroundColor,
  color = 'brand',
  height,
  size = 'large',
  variant = 'solid',
  width,

  /* Native Button */
  className,
  style,
  type = 'button',
  ...props
}: ButtonProps) {
  /* Class Name */
  const buttonClassName = ['eli-button', className].filter(Boolean).join(' ');

  /* Custom Style */
  const buttonStyle: CSSProperties = {
    ...style,
    ...(backgroundColor !== undefined ? { backgroundColor } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(width !== undefined ? { width } : {}),
  };

  return (
    /* Root */
    <button
      {...props}
      className={buttonClassName}
      data-color={color}
      data-size={size}
      data-variant={variant}
      style={buttonStyle}
      type={type}
    >
      {/* Left Icon */}
      {icon ? <span className="eli-button__icon">{icon}</span> : null}

      {/* Text */}
      <span className="eli-button__text eli-typo-label-large">{children}</span>
    </button>
  );
}
