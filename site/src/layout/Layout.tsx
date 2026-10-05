import type { Child } from "hono/jsx";
import { raw } from "hono/html";
import { SIERRA_CONFIG, SIERRA_EMBED } from "./sierra";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type Props = { title: string; path: string; description?: string; children: Child };

const SITE_NAME = "Global Talent UK";

const THEME_COLOR = "#0b1d33";

const FONTS = ["/fonts/gov/inter-latin.woff2", "/fonts/gov/newsreader-latin.woff2"];

const STYLESHEETS = ["tokens", "base", "header", "footer", "home", "page", "components", "guide", "forms"];

const JS_ENABLED =
  "document.body.className += ' js-enabled' + ('noModule' in HTMLScriptElement.prototype ? ' govuk-frontend-supported' : '');";

const INIT_GOVUK = "import { initAll } from '/govuk/govuk-frontend.min.js'; initAll();";

export const Layout = ({ title, path, description, children }: Props) => (
  <>
    {raw("<!DOCTYPE html>")}
    <html lang="en" class="govuk-template">
      <head>
        <meta charset="utf-8" />
        <title>{title === SITE_NAME ? title : `${title} | ${SITE_NAME}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content={THEME_COLOR} />
        <meta name="description" content={description ?? "Visas, tax, schools and support for exceptional people moving to the UK."} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {FONTS.map((href) => (
          <link rel="preload" href={href} as="font" type="font/woff2" crossorigin="anonymous" />
        ))}
        <link rel="stylesheet" href="/govuk/govuk-frontend.min.css" />
        {STYLESHEETS.map((name) => (
          <link rel="stylesheet" href={`/css/${name}.css`} />
        ))}
      </head>
      <body class="govuk-template__body">
        <script dangerouslySetInnerHTML={{ __html: JS_ENABLED }} />
        <a href="#main-content" class="govuk-skip-link" data-module="govuk-skip-link">
          Skip to main content
        </a>
        <SiteHeader path={path} />
        <main class="gt-main" id="main-content" tabindex={-1}>
          {children}
        </main>
        <SiteFooter />
        <script type="module" dangerouslySetInnerHTML={{ __html: INIT_GOVUK }} />
        <script src="/js/nav.js" defer />
        <script dangerouslySetInnerHTML={{ __html: SIERRA_CONFIG }} />
        {raw(SIERRA_EMBED)}
      </body>
    </html>
  </>
);
