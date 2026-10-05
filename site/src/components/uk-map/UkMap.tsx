import { REGIONS } from "../../content/regions";
import { MAP_DOTS } from "./dots";
import { MAP_HEIGHT, MAP_WIDTH, project } from "./projection";

type Props = { variant: "hero" | "light" };

const LABEL_LEFT = new Set(["northern-ireland", "wales", "north-west", "bristol-bath"]);

export const UkMap = ({ variant }: Props) => (
  <figure class={`gt-map gt-map--${variant}`}>
    <svg class="gt-map__svg" viewBox={`-24 -8 ${MAP_WIDTH + 96} ${MAP_HEIGHT + 16}`} role="group" aria-labelledby="gt-map-title">
      <title id="gt-map-title">Map of UK innovation hubs</title>
      <g class="gt-map__land" aria-hidden="true">
        {MAP_DOTS.map(([x, y]) => (
          <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.55" />
        ))}
      </g>
      {REGIONS.map((region) => {
        const [x, y] = project(region.coords);
        const left = LABEL_LEFT.has(region.id);
        return (
          <a class="gt-map__hub" href={`/regions#${region.id}`} aria-label={region.name}>
            <circle class="gt-map__halo" cx={x} cy={y} r="11" />
            <circle class="gt-map__pin" cx={x} cy={y} r="4.5" />
            <text class="gt-map__label" x={left ? x - 12 : x + 12} y={y + 4} text-anchor={left ? "end" : "start"} aria-hidden="true">
              {region.short}
            </text>
          </a>
        );
      })}
    </svg>
  </figure>
);
