import { Icon } from "../components/Icon";
import { BrandMark } from "./BrandMark";
import { isActive, NAVIGATION } from "./navigation";

type Props = { path: string };

export const SiteHeader = ({ path }: Props) => (
  <header class="gt-header" data-gt-header>
    <div class="gt-container gt-header__inner">
      <a href="/" class="gt-header__home">
        <BrandMark />
      </a>
      <button type="button" class="gt-header__toggle" aria-controls="gt-nav" aria-expanded="false" hidden data-gt-nav-toggle>
        <Icon name="menu" class="gt-header__toggle-open" />
        <Icon name="close" class="gt-header__toggle-close" />
        <span class="gt-header__toggle-text">Menu</span>
      </button>
      <nav id="gt-nav" class="gt-nav" aria-label="Main">
        <ul class="gt-nav__list">
          {NAVIGATION.map((item) => {
            const active = isActive(path, item.match);
            return (
              <li class="gt-nav__item">
                <a
                  class={`gt-nav__link${active ? " gt-nav__link--active" : ""}`}
                  href={item.href}
                  aria-current={active ? (path === item.href ? "page" : "true") : undefined}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
        <a class="gt-btn gt-btn--primary gt-btn--small gt-nav__cta" href="/get-in-touch">
          Get in touch
        </a>
      </nav>
    </div>
  </header>
);
