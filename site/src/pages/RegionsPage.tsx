import { ContactPanel } from "../components/ContactPanel";
import { PageHeader } from "../components/PageHeader";
import { UkMap } from "../components/uk-map/UkMap";
import { REGIONS } from "../content/regions";
import { Layout } from "../layout/Layout";

export const RegionsPage = () => (
  <Layout title="Regions" path="/regions">
    <PageHeader
      title="Where to base yourself"
      lead="Innovation hubs across the UK, and the sectors each one leads in."
      crumbs={[]}
      aside={<UkMap variant="light" />}
    />
    <div class="gt-container">
      <ul class="gt-regions">
        {REGIONS.map((region) => (
          <li class="gt-region" id={region.id}>
            <h2 class="gt-region__name">{region.name}</h2>
            <p class="gt-region__summary">{region.summary}</p>
            <ul class="gt-region__tags" aria-label={`Sector strengths in ${region.name}`}>
              {region.sectors.map((sector) => (
                <li class="gt-tag gt-tag--neutral">{sector}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
    <div class="gt-container gt-closing">
      <ContactPanel heading="Want an introduction to a region?" />
    </div>
  </Layout>
);
