import type { Child } from "hono/jsx";

type Props = { id: string; title: string; tag?: string; children: Child };

export const Section = ({ id, title, tag, children }: Props) => (
  <section class="gt-section" id={id} aria-labelledby={`${id}-title`}>
    <h2 class="gt-section__title" id={`${id}-title`}>
      {title}
      {tag ? <span class="gt-tag gt-tag--neutral">{tag}</span> : null}
    </h2>
    {children}
  </section>
);
