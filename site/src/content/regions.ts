export type Region = {
  id: string;
  name: string;
  short: string;
  summary: string;
  sectors: string[];
  coords: readonly [number, number];
};

export const REGIONS: Region[] = [
  {
    id: "london",
    name: "London",
    short: "London",
    summary: "A global financial centre with the UK's largest concentration of startups and investors.",
    sectors: ["AI", "Fintech", "Life sciences", "Creative industries"],
    coords: [-0.13, 51.51],
  },
  {
    id: "oxford-cambridge",
    name: "Cambridge and Oxford",
    short: "Cambridge",
    summary: "Two great universities at the heart of spinout and deep-tech clusters.",
    sectors: ["Biotech", "Semiconductors", "Quantum", "Space and fusion"],
    coords: [0.12, 52.2],
  },
  {
    id: "north-west",
    name: "Manchester and the North West",
    short: "Manchester",
    summary: "A fast-growing digital sector and strong health research.",
    sectors: ["Digital", "Advanced materials", "Health", "Media"],
    coords: [-2.24, 53.48],
  },
  {
    id: "scotland",
    name: "Edinburgh and Scotland",
    short: "Edinburgh",
    summary: "A financial centre and informatics leader, central to the energy transition.",
    sectors: ["Fintech", "AI and data", "Clean energy", "Space"],
    coords: [-3.19, 55.95],
  },
  {
    id: "bristol-bath",
    name: "Bristol and Bath",
    short: "Bristol",
    summary: "An engineering-led region strong in aerospace and chip design.",
    sectors: ["Aerospace", "Semiconductors", "Supercomputing", "Creative"],
    coords: [-2.59, 51.45],
  },
  {
    id: "northern-ireland",
    name: "Belfast and Northern Ireland",
    short: "Belfast",
    summary: "A compact, well-connected tech hub known for cyber security.",
    sectors: ["Cyber security", "Fintech", "Health tech"],
    coords: [-5.93, 54.6],
  },
  {
    id: "wales",
    name: "Wales",
    short: "Wales",
    summary: "Home to a world-leading compound semiconductor cluster.",
    sectors: ["Compound semiconductors", "Clean energy", "Fintech", "Medtech"],
    coords: [-3.7, 52.25],
  },
];
