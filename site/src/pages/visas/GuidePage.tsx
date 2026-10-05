import { ContactPanel } from "../../components/ContactPanel";
import { Icon } from "../../components/Icon";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { Layout } from "../../layout/Layout";
import { rewriteGuideLinks } from "../../lib/rewrite-guide-links";
import type { TrackedGuide } from "../../scraper/tracked-guides";
import type { GuideChange, GuidePart, StoredGuide } from "../../scraper/types";
import { GuideContents } from "./GuideContents";
import { GuideSource } from "./GuideSource";
import { OtherGuides } from "./OtherGuides";

type Props = {
  tracked: TrackedGuide;
  stored: StoredGuide;
  changes: GuideChange[];
  part: GuidePart;
  path: string;
};

export const GuidePage = ({ tracked, stored, changes, part, path }: Props) => {
  const { guide } = stored;
  const index = guide.parts.findIndex((item) => item.slug === part.slug);
  const hrefFor = (position: number) => {
    const target = guide.parts[position];
    if (!target) return undefined;
    return { href: position === 0 ? `/visas/${tracked.slug}` : `/visas/${tracked.slug}/${target.slug}`, label: target.title };
  };

  return (
    <Layout title={index === 0 ? tracked.name : `${part.title}: ${tracked.name}`} path={path} description={guide.description}>
      <PageHeader title={part.title} crumbs={[{ href: "/visas", text: "Visas" }, { href: `/visas/${tracked.slug}`, text: tracked.name }]} />
      <div class="gt-container gt-topic gt-topic--guide">
        <aside class="gt-topic__aside">
          <GuideContents parts={guide.parts} current={part.slug} slug={tracked.slug} />
          <OtherGuides current={tracked.slug} />
        </aside>
        <div class="gt-topic__main">
          <GuideSource stored={stored} changes={changes} slug={tracked.slug} />
          <div class="gt-prose gt-guide-body" dangerouslySetInnerHTML={{ __html: rewriteGuideLinks(part.html, guide, tracked.slug) }} />
          <Pagination previous={hrefFor(index - 1)} next={hrefFor(index + 1)} />
          <p class="gt-guide-source-link">
            <a class="gt-link" href={`https://www.gov.uk${guide.basePath}${index === 0 ? "" : `/${part.slug}`}`}>
              Read this page on GOV.UK
            </a>
            <Icon name="external" />
          </p>
        </div>
      </div>
      <div class="gt-container gt-closing">
        <ContactPanel heading="Need help with your application?" />
      </div>
    </Layout>
  );
};
