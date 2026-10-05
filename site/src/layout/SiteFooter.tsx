import { BrandMark } from "./BrandMark";
import { FOOTER_COLUMNS } from "./footer-links";

export const SiteFooter = () => (
  <footer class="gt-footer gt-on-dark">
    <div class="gt-container">
      <div class="gt-footer__top">
        <div class="gt-footer__brand">
          <a href="/" class="gt-footer__home">
            <BrandMark />
          </a>
          <p class="gt-footer__tagline">For exceptional people building their future in the UK.</p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div class="gt-footer__column">
            <h2 class="gt-footer__heading">{column.title}</h2>
            <ul class="gt-footer__list">
              {column.links.map((link) => (
                <li>
                  <a class="gt-footer__link" href={link.href}>
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div class="gt-footer__bottom">
        <p>
          GOV.UK guidance quoted on this site is available under the{" "}
          <a
            class="gt-footer__link"
            href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
            rel="license"
          >
            Open Government Licence v3.0
          </a>
          .
        </p>
        <p>A prototype built for the Global Talent Taskforce hackathon.</p>
      </div>
    </div>
  </footer>
);
