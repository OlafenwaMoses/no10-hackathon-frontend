export type Link = { href: string; text: string };

export type TopicSection = { id: string; title: string; text: string; link?: Link; tag?: string };

export type TopicContent = {
  parent?: Link;
  path: string;
  navTitle: string;
  title: string;
  lead: string;
  glance: string[];
  sections: TopicSection[];
  official: Link[];
};
