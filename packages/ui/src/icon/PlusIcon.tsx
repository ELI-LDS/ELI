import type { IconProps } from './icon.types.js';

/* 여러 컴포넌트에서 크기와 색상을 상속해 사용하는 Plus Icon */
export function PlusIcon({ size = 20 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height={size}
      viewBox="0 0 20 20"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.8334 10.8322H10.8334V15.8322H9.16675V10.8322H4.16675V9.16553H9.16675V4.16553H10.8334V9.16553H15.8334V10.8322Z"
        fill="currentColor"
      />
    </svg>
  );
}
