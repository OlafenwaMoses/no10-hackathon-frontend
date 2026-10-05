import { LANDMASSES } from "./outline";
import { MAP_HEIGHT, MAP_WIDTH, project } from "./projection";

type Point = readonly [number, number];

const SPACING = 6;

const inside = ([x, y]: Point, polygon: Point[]) => {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i] ?? [0, 0];
    const [xj, yj] = polygon[j] ?? [0, 0];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) result = !result;
  }
  return result;
};

const buildDots = () => {
  const polygons = LANDMASSES.map((mass) => mass.map(project));
  const dots: Point[] = [];
  for (let y = SPACING / 2; y < MAP_HEIGHT; y += SPACING) {
    for (let x = SPACING / 2; x < MAP_WIDTH; x += SPACING) {
      if (polygons.some((polygon) => inside([x, y], polygon))) dots.push([x, y]);
    }
  }
  return dots;
};

export const MAP_DOTS = buildDots();
