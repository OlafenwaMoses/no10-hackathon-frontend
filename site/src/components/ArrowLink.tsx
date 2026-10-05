import { Icon } from "./Icon";

type Props = { href: string; text: string; context?: string };

export const ArrowLink = ({ href, text, context }: Props) => (
  <a class="gt-arrow-link" href={href}>
    {text}
    {context ? <span class="gt-visually-hidden"> {context}</span> : null}
    <Icon name={href.startsWith("/") ? "arrow" : "external"} class="gt-icon--arrow" />
  </a>
);
