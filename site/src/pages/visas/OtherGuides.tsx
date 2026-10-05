import { TRACKED_GUIDES } from "../../scraper/tracked-guides";

type Props = { current: string };

export const OtherGuides = ({ current }: Props) => (
  <nav class="gt-toc" aria-label="Other visa guides">
    <h2 class="gt-toc__title">Other visa guides</h2>
    <ul class="gt-toc__list">
      <li>
        <a class="gt-toc__link" href="/visas">
          Compare UK visa routes
        </a>
      </li>
      {TRACKED_GUIDES.filter((item) => item.slug !== current).map((item) => (
        <li>
          <a class="gt-toc__link" href={`/visas/${item.slug}`}>
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);
