type Crumb = { href: string; text: string };

type Props = { items: Crumb[] };

export const Breadcrumbs = ({ items }: Props) => (
  <nav class="gt-crumbs" aria-label="Breadcrumb">
    <ol class="gt-crumbs__list">
      {[{ href: "/", text: "Home" }, ...items].map((item) => (
        <li class="gt-crumbs__item">
          <a class="gt-crumbs__link" href={item.href}>
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  </nav>
);
