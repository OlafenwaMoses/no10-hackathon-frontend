import { Icon } from "../../components/Icon";
import { HOME_TOPICS } from "../../content/topics";
import { GuideFeature } from "./GuideFeature";

export const PlanYourMove = () => (
  <section class="gt-band gt-band--alt" aria-labelledby="plan-title">
    <div class="gt-container">
      <div class="gt-band__head">
        <h2 class="gt-h2" id="plan-title">
          Plan your move
        </h2>
      </div>
      <div class="gt-plan">
        <GuideFeature />
        <ul class="gt-topics">
          {HOME_TOPICS.map((topic) => (
            <li>
              <a class="gt-topic-link" href={topic.href}>
                <span class="gt-topic-link__icon">
                  <Icon name={topic.icon} />
                </span>
                <span class="gt-topic-link__body">
                  <span class="gt-topic-link__title">{topic.title}</span>
                  <span class="gt-topic-link__text">{topic.text}</span>
                </span>
                <Icon name="chevron" class="gt-topic-link__chevron" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
