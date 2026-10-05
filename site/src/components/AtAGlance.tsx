import { Icon } from "./Icon";

type Props = { items: string[] };

export const AtAGlance = ({ items }: Props) => (
  <section class="gt-glance" aria-labelledby="glance-title">
    <h2 class="gt-glance__title" id="glance-title">
      At a glance
    </h2>
    <ul class="gt-glance__list">
      {items.map((item) => (
        <li class="gt-glance__item">
          <Icon name="check" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </section>
);
