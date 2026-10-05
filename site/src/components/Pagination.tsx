import { Icon } from "./Icon";

type Link = { href: string; label: string };

type Props = { previous?: Link; next?: Link };

export const Pagination = ({ previous, next }: Props) => (
  <nav class="gt-pager" aria-label="Pagination">
    {previous ? (
      <a class="gt-pager__link gt-pager__link--prev" href={previous.href} rel="prev">
        <span class="gt-pager__dir">
          <Icon name="arrow" />
          Previous<span class="gt-visually-hidden"> page:</span>
        </span>
        <span class="gt-pager__label">{previous.label}</span>
      </a>
    ) : null}
    {next ? (
      <a class="gt-pager__link gt-pager__link--next" href={next.href} rel="next">
        <span class="gt-pager__dir">
          Next<span class="gt-visually-hidden"> page:</span>
          <Icon name="arrow" />
        </span>
        <span class="gt-pager__label">{next.label}</span>
      </a>
    ) : null}
  </nav>
);
