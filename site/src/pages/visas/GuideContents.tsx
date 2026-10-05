import type { GuidePart } from "../../scraper/types";

type Props = { parts: GuidePart[]; current: string; slug: string };

export const GuideContents = ({ parts, current, slug }: Props) => (
  <nav class="gt-toc gt-toc--numbered" aria-label="Pages in this guide">
    <h2 class="gt-toc__title">Contents</h2>
    <ol class="gt-toc__list">
      {parts.map((part, index) => (
        <li>
          {part.slug === current ? (
            <span aria-current="page" class="gt-toc__link gt-toc__link--current">
              {part.title}
            </span>
          ) : (
            <a class="gt-toc__link" href={index === 0 ? `/visas/${slug}` : `/visas/${slug}/${part.slug}`}>
              {part.title}
            </a>
          )}
        </li>
      ))}
    </ol>
  </nav>
);
