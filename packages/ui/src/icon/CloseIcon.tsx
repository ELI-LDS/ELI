import type { IconProps } from './icon.types.js';

/* 여러 컴포넌트에서 크기와 색상을 상속해 사용하는 Close Icon */
export function CloseIcon({ size = 24 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
        fill="currentColor"
      />
    </svg>
  );
}
