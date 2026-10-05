const WEST = -8.4;
const NORTH = 59.4;
const SCALE = 50;
const LON_FACTOR = Math.cos((54.5 * Math.PI) / 180);

export const MAP_WIDTH = Math.round((2.0 - WEST) * LON_FACTOR * SCALE);
export const MAP_HEIGHT = Math.round((NORTH - 49.8) * SCALE);

export const project = ([lon, lat]: readonly [number, number]) =>
  [(lon - WEST) * LON_FACTOR * SCALE, (NORTH - lat) * SCALE] as const;
