import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
      viewBox="0 0 24 24"
      {...props}
    />
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 10.75L12 4l9 6.75" />
      <path d="M5.5 9.75V20h13V9.75" />
      <path d="M9.5 20v-5h5v5" />
    </BaseIcon>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect height="7" rx="1.5" width="7" x="3.5" y="3.5" />
      <rect height="7" rx="1.5" width="7" x="13.5" y="3.5" />
      <rect height="7" rx="1.5" width="7" x="3.5" y="13.5" />
      <rect height="7" rx="1.5" width="7" x="13.5" y="13.5" />
    </BaseIcon>
  );
}

export function ShoppingBagIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 8.5h14l-1 11H6L5 8.5z" />
      <path d="M9 9V7.75A3 3 0 0112 4.75a3 3 0 013 3V9" />
    </BaseIcon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </BaseIcon>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 6.5h16" />
      <path d="M7 12h10" />
      <path d="M10 17.5h4" />
    </BaseIcon>
  );
}

export function MessageIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6 18l-1.5 2.5V6.75A2.75 2.75 0 017.25 4h9.5A2.75 2.75 0 0119.5 6.75v7.5A2.75 2.75 0 0116.75 17H8z" />
      <path d="M8.5 8.5h7" />
      <path d="M8.5 12h4.5" />
    </BaseIcon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 6l6 6-6 6" />
    </BaseIcon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5.5 12.5l4 4L18.5 7.5" />
    </BaseIcon>
  );
}
