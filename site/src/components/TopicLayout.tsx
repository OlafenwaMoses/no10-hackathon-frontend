import type { Child } from "hono/jsx";
import { ContentsList } from "./ContentsList";

type Item = { id: string; title: string };

type Props = { sections: Item[]; children: Child };

export const TopicLayout = ({ sections, children }: Props) => (
  <div class="gt-container gt-topic">
    <aside class="gt-topic__aside">{sections.length > 1 ? <ContentsList items={sections} /> : null}</aside>
    <div class="gt-topic__main">{children}</div>
  </div>
);
