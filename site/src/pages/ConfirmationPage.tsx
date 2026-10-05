import { ArrowLink } from "../components/ArrowLink";
import { Icon } from "../components/Icon";
import { Layout } from "../layout/Layout";

export const ConfirmationPage = () => (
  <Layout title="Thank you" path="/get-in-touch">
    <div class="gt-container gt-confirm">
      <div class="gt-confirm__panel">
        <span class="gt-confirm__icon">
          <Icon name="check" />
        </span>
        <h1 class="gt-h1">Thank you</h1>
        <p class="gt-lead">The Global Talent Taskforce will be in touch, usually within a few working days.</p>
      </div>
      <h2 class="gt-confirm__next">While you wait</h2>
      <ul class="gt-confirm__links">
        <li>
          <ArrowLink href="/visas" text="Compare UK visa routes" />
        </li>
        <li>
          <ArrowLink href="/regions" text="Explore the UK's regions" />
        </li>
        <li>
          <ArrowLink href="/moving-to-the-uk" text="Plan your move" />
        </li>
      </ul>
    </div>
  </Layout>
);
