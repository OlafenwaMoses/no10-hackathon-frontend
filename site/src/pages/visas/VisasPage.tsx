import { CheckLatest } from "../../components/CheckLatest";
import { ContactPanel } from "../../components/ContactPanel";
import { PageHeader } from "../../components/PageHeader";
import { Layout } from "../../layout/Layout";
import { VisaComparison } from "./VisaComparison";
import { VisaNotes } from "./VisaNotes";

export const VisasPage = () => (
  <Layout title="Visas" path="/visas" description="Compare the main UK visa routes for global talent.">
    <PageHeader title="Visas" lead="The main routes for exceptional people, founders and senior hires." crumbs={[]} />
    <div class="gt-container">
      <section aria-labelledby="compare-title" class="gt-stack">
        <h2 class="gt-visually-hidden" id="compare-title">
          Compare the main routes
        </h2>
        <VisaComparison />
      </section>
      <VisaNotes />
      <CheckLatest
        links={[
          { href: "https://www.gov.uk/check-uk-visa", text: "Check if you need a visa" },
          { href: "https://www.gov.uk/visa-fees", text: "Fees and processing times" },
        ]}
      />
    </div>
    <div class="gt-container gt-closing">
      <ContactPanel heading="Not sure which route fits?" />
    </div>
  </Layout>
);
