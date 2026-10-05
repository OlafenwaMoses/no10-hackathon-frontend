import { formatDate } from "../../lib/format-date";
import type { GuideChange } from "../../scraper/types";

type Props = { changes: GuideChange[]; slug: string; firstPartSlug: string };

const CHANGE_LABELS = { added: "added", removed: "removed", updated: "updated" } as const;

export const ChangeHistory = ({ changes, slug, firstPartSlug }: Props) => (
  <details class="gt-history">
    <summary class="gt-history__summary">Recent changes ({changes.length})</summary>
    <ol class="gt-history__list">
      {changes.map((change) => (
        <li class="gt-history__item">
          <p class="gt-history__when">Updated {formatDate(change.publicUpdatedAt)}</p>
          <ul class="gt-history__parts">
            {change.parts.length === 0 ? <li>Guide title or structure changed</li> : null}
            {change.parts.map((part) => (
              <li>
                {part.change === "removed" ? (
                  part.title
                ) : (
                  <a class="gt-link" href={part.slug === firstPartSlug ? `/visas/${slug}` : `/visas/${slug}/${part.slug}`}>
                    {part.title}
                  </a>
                )}{" "}
                {CHANGE_LABELS[part.change]}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  </details>
);
