import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

const source = "node_modules/govuk-frontend/dist/govuk";
const target = "public/govuk";
const fontTarget = "public/fonts/gov";

const FONTS = [
  ["@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", "inter-latin.woff2"],
  ["@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2", "inter-latin-ext.woff2"],
  ["@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2", "newsreader-latin.woff2"],
  ["@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2", "newsreader-latin-italic.woff2"],
] as const;

const stripRestrictedAssets = (css: string) =>
  css
    .replace(/\/\*[^*]*exclusive use on gov\.uk[\s\S]*?\*\//g, "")
    .replace(/@font-face\{[^}]*\}/g, "")
    .replace(/GDS Transport,arial,sans-serif/g, "var(--font-body,arial,sans-serif)")
    .replace(/GDS Transport,/g, "")
    .replace(/font-family:GDS Transport/g, "font-family:var(--font-body,arial,sans-serif)")
    .replace(/url\(\/assets\/images\/govuk-crest\.svg\)/g, "none")
    .replace(/\/\*# sourceMappingURL=[^*]*\*\//g, "");

const stripSourceMap = (js: string) => js.replace(/\/\/# sourceMappingURL=\S+/g, "");

await mkdir(target, { recursive: true });
await mkdir(fontTarget, { recursive: true });

const css = stripRestrictedAssets(await readFile(`${source}/govuk-frontend.min.css`, "utf8"));
if (css.includes("GDS Transport") || css.includes("/assets/")) {
  throw new Error("Restricted GOV.UK assets are still referenced in the CSS");
}
await writeFile(`${target}/govuk-frontend.min.css`, css);

const js = stripSourceMap(await readFile(`${source}/govuk-frontend.min.js`, "utf8"));
await writeFile(`${target}/govuk-frontend.min.js`, js);

await Promise.all(FONTS.map(([from, to]) => copyFile(`node_modules/${from}`, `${fontTarget}/${to}`)));

console.log(`Copied GOV.UK Frontend CSS and JS to ${target} and fonts to ${fontTarget} (GOV.UK fonts and crown assets excluded)`);
