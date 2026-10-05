import type { Child } from "hono/jsx";

type Props = { summary: string; children: Child };

export const Details = ({ summary, children }: Props) => (
  <details class="govuk-details">
    <summary class="govuk-details__summary">
      <span class="govuk-details__summary-text">{summary}</span>
    </summary>
    <div class="govuk-details__text">{children}</div>
  </details>
);
