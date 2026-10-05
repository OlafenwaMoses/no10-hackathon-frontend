import { CheckLatest } from "../../components/CheckLatest";
import { ContactPanel } from "../../components/ContactPanel";
import { Icon } from "../../components/Icon";
import { PageHeader } from "../../components/PageHeader";
import { Section } from "../../components/Section";
import { TopicLayout } from "../../components/TopicLayout";
import type { Persona } from "../../content/personas";
import { Layout } from "../../layout/Layout";

type Props = { persona: Persona; path: string };

const SECTIONS = [
  { id: "visas", title: "Visa routes" },
  { id: "help", title: "How we can help" },
];

export const PersonaPage = ({ persona, path }: Props) => (
  <Layout title={persona.title} path={path} description={persona.card}>
    <PageHeader title={persona.title} lead={persona.intro} crumbs={[{ href: "/#routes", text: "Your route" }]} />
    <TopicLayout sections={SECTIONS}>
      <Section id="visas" title="Visa routes">
        <ul class="gt-options">
          {persona.visas.map((visa) => (
            <li class="gt-option">
              <h3 class="gt-option__name">
                <a class="gt-option__link" href={visa.href}>
                  {visa.name}
                </a>
              </h3>
              <p class="gt-option__fit">{visa.fit}</p>
              <Icon name="arrow" class="gt-option__arrow" />
            </li>
          ))}
        </ul>
      </Section>
      <Section id="help" title="How the Taskforce can help">
        <ul class="gt-checklist">
          {persona.help.map((item) => (
            <li>
              <Icon name="check" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>
      <CheckLatest links={persona.links} />
    </TopicLayout>
    <div class="gt-container gt-closing">
      <ContactPanel category={persona.category} />
    </div>
  </Layout>
);
