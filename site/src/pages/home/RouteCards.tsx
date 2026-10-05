import { Icon } from "../../components/Icon";
import type { IconName } from "../../components/icon-paths";
import { PERSONAS } from "../../content/personas";

const ICONS: Record<string, IconName> = {
  founders: "founders",
  investors: "investors",
  researchers: "researchers",
  executives: "executives",
  "exceptional-talent": "talent",
};

export const RouteCards = () => (
  <section class="gt-band" id="routes" aria-labelledby="routes-title">
    <div class="gt-container">
      <div class="gt-band__head">
        <h2 class="gt-h2" id="routes-title">
          Find your route
        </h2>
      </div>
      <ul class="gt-routes">
        {PERSONAS.map((persona) => (
          <li class="gt-routes__item">
            <a class="gt-route" href={`/your-route/${persona.slug}`}>
              <span class="gt-route__icon">
                <Icon name={ICONS[persona.slug] ?? "talent"} />
              </span>
              <span class="gt-route__title">{persona.title}</span>
              <span class="gt-route__text">{persona.card}</span>
              <span class="gt-route__go">
                <Icon name="arrow" class="gt-icon--arrow" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
