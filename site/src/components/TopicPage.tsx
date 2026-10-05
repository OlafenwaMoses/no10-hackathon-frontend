import type { TopicContent } from "../content/topic-content";
import { Layout } from "../layout/Layout";
import { ArrowLink } from "./ArrowLink";
import { AtAGlance } from "./AtAGlance";
import { CheckLatest } from "./CheckLatest";
import { ContactPanel } from "./ContactPanel";
import { PageHeader } from "./PageHeader";
import { Section } from "./Section";
import { TopicLayout } from "./TopicLayout";

type Props = { content: TopicContent };

export const TopicPage = ({ content }: Props) => (
  <Layout title={content.navTitle} path={content.path} description={content.lead}>
    <PageHeader title={content.title} lead={content.lead} crumbs={content.parent ? [content.parent] : []} />
    <TopicLayout sections={content.sections}>
      <AtAGlance items={content.glance} />
      {content.sections.map((section) => (
        <Section id={section.id} title={section.title} tag={section.tag}>
          <p class="gt-section__text">{section.text}</p>
          {section.link ? <ArrowLink href={section.link.href} text={section.link.text} /> : null}
        </Section>
      ))}
      <CheckLatest links={content.official} />
    </TopicLayout>
    <div class="gt-container gt-closing">
      <ContactPanel />
    </div>
  </Layout>
);
