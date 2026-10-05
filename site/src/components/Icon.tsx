import { ICON_PATHS, type IconName } from "./icon-paths";

type Props = { name: IconName; class?: string };

export const Icon = ({ name, class: className }: Props) => (
  <svg
    class={`gt-icon gt-icon--${name}${className ? ` ${className}` : ""}`}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    {ICON_PATHS[name]}
  </svg>
);
