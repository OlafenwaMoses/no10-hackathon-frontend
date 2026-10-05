import { Icon } from "../../components/Icon";

export const GuideFeature = () => (
  <a class="gt-feature" href="/visas/global-talent">
    <span class="gt-feature__icon">
      <Icon name="visa" />
    </span>
    <span class="gt-feature__title">Global Talent visa</span>
    <span class="gt-feature__text">The official guide, step by step.</span>
    <span class="gt-feature__cta">
      Read the guide <Icon name="arrow" class="gt-icon--arrow" />
    </span>
  </a>
);
