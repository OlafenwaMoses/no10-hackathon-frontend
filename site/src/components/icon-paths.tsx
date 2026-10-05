import type { Child } from "hono/jsx";

export const ICON_PATHS = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  founders: (
    <>
      <path d="M9 18h6M10 21.5h4" />
      <path d="M12 2.5a6.5 6.5 0 0 0-3.9 11.7c.6.5.9 1.2.9 2V16h6v-.1c0-.8.3-1.5.9-2A6.5 6.5 0 0 0 12 2.5z" />
    </>
  ),
  investors: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  researchers: <path d="M9 3h6M10 3v6.2L4.6 18.4A2 2 0 0 0 6.3 21.5h11.4a2 2 0 0 0 1.7-3.1L14 9.2V3M7.2 15h9.6" />,
  executives: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7M3 13h18" />
    </>
  ),
  talent: <path d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8z" />,
  visa: (
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9 17h6" />
    </>
  ),
  tax: (
    <>
      <path d="M18.5 5.5l-13 13" />
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
    </>
  ),
  school: <path d="M2.5 4.5H8a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2.5zM21.5 4.5H16a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h6.5z" />,
  health: (
    <>
      <path d="M12 20.5s-8.5-5-8.5-11.2A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.5 2.7C20.5 15.5 12 20.5 12 20.5z" />
      <path d="M7.5 12h2.2l1.3-2.2 2 4.4 1.3-2.2h2.2" />
    </>
  ),
  home: <path d="M3 10.5L12 3l9 7.5M5.5 8.6v11.9h13V8.6M10 20.5v-6h4v6" />,
  pin: (
    <>
      <path d="M12 21s-7-6-7-11.5a7 7 0 0 1 14 0C19 15 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  external: <path d="M14 4h6v6M20 4l-8.5 8.5M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.1" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  chevron: <path d="M9 6l6 6-6 6" />,
} satisfies Record<string, Child>;

export type IconName = keyof typeof ICON_PATHS;
