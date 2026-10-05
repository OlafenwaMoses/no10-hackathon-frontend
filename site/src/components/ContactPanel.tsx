import { Icon } from "./Icon";

type Props = { heading?: string; category?: string };

export const ContactPanel = ({ heading, category }: Props) => (
  <section class="gt-contact gt-on-dark" aria-labelledby="contact-title">
    <div class="gt-contact__inner">
      <h2 class="gt-h2 gt-contact__title" id="contact-title">
        {heading ?? "Talk to the Global Talent Taskforce"}
      </h2>
      <p class="gt-contact__text">Tell us your plans. We can help with routes, introductions and a smooth landing.</p>
      <a
        href={category ? `/get-in-touch?category=${encodeURIComponent(category)}` : "/get-in-touch"}
        class="gt-btn gt-btn--accent gt-contact__cta"
      >
        Get in touch <Icon name="arrow" class="gt-icon--arrow" />
      </a>
    </div>
  </section>
);
