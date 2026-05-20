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

export function RowsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect height="4.25" rx="1.5" width="17" x="3.5" y="4" />
      <rect height="4.25" rx="1.5" width="17" x="3.5" y="9.875" />
      <rect height="4.25" rx="1.5" width="17" x="3.5" y="15.75" />
    </BaseIcon>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="5.25" cy="6.25" fill="currentColor" r="1.1" stroke="none" />
      <circle cx="5.25" cy="12" fill="currentColor" r="1.1" stroke="none" />
      <circle cx="5.25" cy="17.75" fill="currentColor" r="1.1" stroke="none" />
      <path d="M9 6.25h10.25" />
      <path d="M9 12h10.25" />
      <path d="M9 17.75h10.25" />
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

export function MenuIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </BaseIcon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6.5 6.5l11 11" />
      <path d="M17.5 6.5l-11 11" />
    </BaseIcon>
  );
}

export function PackageIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3.75l7.25 3.75v9L12 20.25 4.75 16.5v-9L12 3.75z" />
      <path d="M12 3.75v16.5" />
      <path d="M4.75 7.5L12 11.25 19.25 7.5" />
    </BaseIcon>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M13.5 4.5H19.5v6L11 19 5 13 13.5 4.5z" />
      <circle cx="16.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function BookmarkIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 4.5h10A1.5 1.5 0 0118.5 6v13.5L12 15.5l-6.5 4V6A1.5 1.5 0 017 4.5z" />
    </BaseIcon>
  );
}

export function MegaphoneIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M13.5 6.5l5.75-2v11l-5.75-2H8.25a2.75 2.75 0 01-2.75-2.75v-1.5A2.75 2.75 0 018.25 6.5h5.25z" />
      <path d="M8.5 13.5l1.5 5h2.5l-1.25-4.75" />
    </BaseIcon>
  );
}

export function ClipboardListIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 4.75h6" />
      <path d="M9.25 3.5h5.5A1.75 1.75 0 0116.5 5.25V6H7.5v-.75A1.75 1.75 0 019.25 3.5z" />
      <path d="M7.5 6H6.75A1.75 1.75 0 005 7.75v10.5A1.75 1.75 0 006.75 20h10.5A1.75 1.75 0 0019 18.25V7.75A1.75 1.75 0 0017.25 6h-.75" />
      <path d="M8.5 10h7" />
      <path d="M8.5 13.5h7" />
      <path d="M8.5 17h4.5" />
    </BaseIcon>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="3.25" />
      <path d="M12 4.5v1.75" />
      <path d="M12 17.75V19.5" />
      <path d="M19.5 12h-1.75" />
      <path d="M6.25 12H4.5" />
      <path d="M17.3 6.7L16.05 7.95" />
      <path d="M7.95 16.05L6.7 17.3" />
      <path d="M17.3 17.3l-1.25-1.25" />
      <path d="M7.95 7.95L6.7 6.7" />
    </BaseIcon>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M2.75 12s3.25-5.75 9.25-5.75S21.25 12 21.25 12 18 17.75 12 17.75 2.75 12 2.75 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </BaseIcon>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3.5 3.5l17 17" />
      <path d="M10.5 6.45A9.4 9.4 0 0112 6.25c6 0 9.25 5.75 9.25 5.75a16.8 16.8 0 01-3.4 4.08" />
      <path d="M7.05 7.05A16.36 16.36 0 002.75 12s3.25 5.75 9.25 5.75a9.9 9.9 0 003.15-.5" />
      <path d="M10.59 10.59A2 2 0 0010 12a2 2 0 002 2c.52 0 1-.2 1.41-.59" />
    </BaseIcon>
  );
}
