import { Icon } from "./Icon";

type Link = { href: string; text: string };

type Props = { links: Link[] };

export const CheckLatest = ({ links }: Props) => (
  <aside class="gt-check" aria-label="Official guidance">
    <Icon name="info" />
    <p class="gt-check__text">
      <strong>Rules change.</strong> Check the latest on GOV.UK:{" "}
      {links.map((link, index) => (
        <>
          {index > 0 ? <span class="gt-check__sep" aria-hidden="true"> · </span> : null}
          <a class="gt-link" href={link.href}>
            {link.text}
          </a>
        </>
      ))}
    </p>
  </aside>
);
