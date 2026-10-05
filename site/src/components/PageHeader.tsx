import type { Child } from "hono/jsx";
import { Breadcrumbs } from "./Breadcrumbs";

type Crumb = { href: string; text: string };

type Props = { title: string; lead?: string; crumbs?: Crumb[]; aside?: Child; children?: Child };

export const PageHeader = ({ title, lead, crumbs, aside, children }: Props) => (
  <header class={`gt-page-header${aside ? " gt-page-header--split" : ""}`}>
    <div class="gt-container">
      {crumbs ? <Breadcrumbs items={crumbs} /> : null}
      <div class="gt-page-header__inner">
        <div class="gt-page-header__copy">
          <h1 class="gt-h1">{title}</h1>
          {lead ? <p class="gt-lead gt-page-header__lead">{lead}</p> : null}
          {children}
        </div>
        {aside ? <div class="gt-page-header__aside">{aside}</div> : null}
      </div>
    </div>
  </header>
);
