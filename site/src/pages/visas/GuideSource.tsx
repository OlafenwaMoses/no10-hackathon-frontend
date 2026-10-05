import { Icon } from "../../components/Icon";
import { formatDate } from "../../lib/format-date";
import type { GuideChange, StoredGuide } from "../../scraper/types";
import { ChangeHistory } from "./ChangeHistory";

type Props = { stored: StoredGuide; changes: GuideChange[]; slug: string };

export const GuideSource = ({ stored, changes, slug }: Props) => (
  <aside class="gt-source" aria-label="Source">
    <p class="gt-source__line">
      <Icon name="info" />
      <span>
        From{" "}
        <a class="gt-link" href={`https://www.gov.uk${stored.guide.basePath}`}>
          GOV.UK
        </a>
        <span class="gt-source__sep" aria-hidden="true">
          {" · "}
        </span>
        Last updated <time datetime={stored.guide.publicUpdatedAt}>{formatDate(stored.guide.publicUpdatedAt)}</time>
      </span>
    </p>
    {changes.length > 0 ? (
      <ChangeHistory changes={changes} slug={slug} firstPartSlug={stored.guide.parts[0]?.slug ?? ""} />
    ) : null}
  </aside>
);
