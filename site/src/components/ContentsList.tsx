type Item = { id: string; title: string };

type Props = { items: Item[] };

export const ContentsList = ({ items }: Props) => (
  <nav class="gt-toc" aria-label="On this page">
    <h2 class="gt-toc__title">On this page</h2>
    <ul class="gt-toc__list">
      {items.map((item) => (
        <li>
          <a class="gt-toc__link" href={`#${item.id}`}>
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);
