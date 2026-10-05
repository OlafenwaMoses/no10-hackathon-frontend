import { Icon } from "../../components/Icon";
import { UkMap } from "../../components/uk-map/UkMap";

export const Hero = () => (
  <section class="gt-hero gt-on-dark" aria-labelledby="hero-title">
    <div class="gt-container gt-hero__inner">
      <div class="gt-hero__copy">
        <h1 class="gt-display gt-hero__title" id="hero-title">
          Build what's next in the UK.
        </h1>
        <p class="gt-hero__lead">For founders, investors, researchers and leaders making the move.</p>
        <div class="gt-hero__actions">
          <a class="gt-btn gt-btn--accent" href="#routes">
            Find your route <Icon name="arrow" />
          </a>
          <a class="gt-btn gt-btn--ghost" href="/get-in-touch">
            Talk to the Taskforce
          </a>
        </div>
      </div>
      <div class="gt-hero__visual">
        <UkMap variant="hero" />
      </div>
    </div>
  </section>
);
