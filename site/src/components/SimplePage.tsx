import type { Child } from "hono/jsx";
import { Layout } from "../layout/Layout";
import { PageHeader } from "./PageHeader";

type Props = { title: string; heading?: string; lead?: string; path: string; children: Child };

export const SimplePage = ({ title, heading, lead, path, children }: Props) => (
  <Layout title={title} path={path}>
    <PageHeader title={heading ?? title} lead={lead} crumbs={[]} />
    <div class="gt-container">
      <div class="gt-prose gt-simple">{children}</div>
    </div>
  </Layout>
);
