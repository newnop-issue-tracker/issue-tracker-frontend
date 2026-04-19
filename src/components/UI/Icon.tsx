import type { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  sw?: number;
}

const baseProps = (size: number, sw: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: sw,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
});

const make = (paths: (props: SVGProps<SVGSVGElement>) => React.ReactNode) => {
  return function Icon({ size = 16, sw = 1.5, ...rest }: IconProps) {
    return (
      <svg {...baseProps(size, sw)} {...rest}>
        {paths(rest)}
      </svg>
    );
  };
};

export const Icon = {
  Search: make(() => (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  )),
  Plus: make(() => <path d="M12 5v14M5 12h14" />),
  Check: make(() => <path d="M5 12.5l5 5L20 7" />),
  X: make(() => <path d="M6 6l12 12M6 18L18 6" />),
  ChevRight: make(() => <path d="M9 6l6 6-6 6" />),
  ChevLeft: make(() => <path d="M15 6l-6 6 6 6" />),
  ChevDown: make(() => <path d="M6 9l6 6 6-6" />),
  Sun: make(() => (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
    </>
  )),
  Moon: make(() => <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />),
  Bell: make(() => (
    <path d="M6 10a6 6 0 1 1 12 0v4l1.5 3h-15L6 14v-4zM10 20a2 2 0 0 0 4 0" />
  )),
  Inbox: make(() => (
    <path d="M3 13l4-8h10l4 8M3 13v6a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6M3 13h5l1 2h6l1-2h5" />
  )),
  Filter: make(() => <path d="M3 5h18M6 12h12M10 19h4" />),
  Edit: make(() => <path d="M4 20h4l10-10-4-4L4 16v4zM14 6l4 4" />),
  Trash: make(() => (
    <path d="M4 7h16M10 7V4h4v3M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M10 11v6M14 11v6" />
  )),
  Clock: make(() => (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  )),
  CheckCircle: make(() => (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l3 3 5-6" />
    </>
  )),
  Archive: make(() => (
    <path d="M3 4h18v4H3zM5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 13h4" />
  )),
  AlertTri: make(() => <path d="M12 3 2 20h20L12 3zM12 10v5M12 18v.5" />),
  Mail: make(() => (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  )),
  Lock: make(() => (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
    </>
  )),
  User: make(() => (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  )),
  Bolt: make(() => <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7z" />),
  Hash: make(() => <path d="M5 9h14M5 15h14M10 3L8 21M16 3l-2 18" />),
  LogOut: make(() => (
    <path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4M16 17l5-5-5-5M21 12H10" />
  )),
  Code: make(() => <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />),
  FileText: make(() => <path d="M7 3h8l4 4v14H7zM15 3v4h4M10 13h6M10 17h4" />),
  MessageSquare: make(() => (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  )),
};
