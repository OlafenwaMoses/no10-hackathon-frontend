import { ContactPanel } from "../components/ContactPanel";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { HEALTHCARE } from "../content/pages/healthcare";
import { LIVING } from "../content/pages/living";
import { SCHOOLS } from "../content/pages/schools";
import { TAX } from "../content/pages/tax";
import { MOVING_TOPICS } from "../content/topics";
import { Layout } from "../layout/Layout";

const SECTIONS: Record<string, { id: string; title: string }[]> = {
  [TAX.path]: TAX.sections,
  [SCHOOLS.path]: SCHOOLS.sections,
  [HEALTHCARE.path]: HEALTHCARE.sections,
  [LIVING.path]: LIVING.sections,
};

export const MovingPage = () => (
  <Layout title="Moving to the UK" path="/moving-to-the-uk">
    <PageHeader title="Moving to the UK" lead="Tax, schools, healthcare and settling in." crumbs={[]} />
    <div class="gt-container">
      <ul class="gt-hub">
        {MOVING_TOPICS.map((topic) => (
          <li class="gt-hub__item">
            <article class="gt-hub-card">
              <span class="gt-hub-card__icon">
                <Icon name={topic.icon} />
              </span>
              <h2 class="gt-hub-card__title">
                <a class="gt-hub-card__link" href={topic.href}>
                  {topic.title}
                </a>
              </h2>
              <p class="gt-hub-card__text">{topic.text}</p>
              <ul class="gt-hub-card__sections">
                {(SECTIONS[topic.href] ?? []).map((section) => (
                  <li>
                    <a class="gt-link" href={`${topic.href}#${section.id}`}>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ul>
      <p class="gt-hub__more">
        <Icon name="pin" />
        <span>
          Choosing a city? <a class="gt-link" href="/regions">Compare the UK's regions</a>
        </span>
      </p>
    </div>
    <div class="gt-container gt-closing">
      <ContactPanel />
    </div>
  </Layout>
);
