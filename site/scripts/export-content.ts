import { parseHTML } from "linkedom";
import TurndownService from "turndown";

const BASE = process.env.SITE_URL ?? "http://localhost:8788";
const SKIP = /^\/(refresh|theme|css|js|fonts|govuk|favicon|robots)/;
const seen = new Set<string>();
const queue = ["/"];
const pages: { path: string; title: string; md: string }[] = [];
const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced" });
td.remove(["script", "style", "noscript", "svg", "form"]);
td.addRule("absolute-links", {
  filter: (node) => node.nodeName === "A" && !!node.getAttribute("href"),
  replacement: (content, node) => {
    const href = (node as unknown as Element).getAttribute("href") ?? "";
    const text = content.trim();
    if (!text) return "";
    if (href.startsWith("#")) return text;
    const url = href.startsWith("/") ? `${BASE}${href}`.replace(BASE, "") : href;
    return `[${text}](${url})`;
  },
});

while (queue.length) {
  const path = queue.shift()!;
  if (seen.has(path)) continue;
  seen.add(path);
  const res = await fetch(BASE + path);
  if (!res.ok || !(res.headers.get("content-type") ?? "").includes("text/html")) continue;
  const html = await res.text();
  const { document } = parseHTML(html);
  for (const a of document.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href")!.split("#")[0].split("?")[0];
    if (href.startsWith("/") && !href.startsWith("//") && !SKIP.test(href) && !seen.has(href)) queue.push(href);
  }
  const main = document.querySelector("main") ?? document.body;
  for (const el of main.querySelectorAll("nav, aside, .govuk-breadcrumbs, [data-sierra-chat], .gt-skip")) el.remove();
  if (path !== "/") {
    for (const h of main.querySelectorAll("h2")) {
      if (h.textContent?.includes("Talk to the Global Talent Taskforce")) (h.closest("section") ?? h.parentElement)?.remove();
    }
  }
  for (const a of main.querySelectorAll("a")) {
    const parts = [...a.children].map((el) => el.textContent?.replace(/\s+/g, " ").trim()).filter((t) => t && !/^(read the guide|view|learn more)$/i.test(t));
    if (parts.length > 1) a.textContent = parts.join(" — ");
  }
  if (path === "/get-in-touch") {
    const labels = [...document.querySelectorAll("form label, form legend")].map((el) => `- ${el.textContent?.replace(/\s+/g, " ").trim()}`);
    main.insertAdjacentHTML("beforeend", `<h2>Form fields</h2><ul>${labels.map((l) => `<li>${l.slice(2)}</li>`).join("")}</ul>`);
  }
  const h1 = document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
  const docTitle = document.title.split(/ [-–|] /)[0].trim();
  const title = path.startsWith("/visas/") ? docTitle.replace(/^Overview: /, "") : h1 || docTitle;
  const md = td.turndown(main.innerHTML).replace(/\n{3,}/g, "\n\n").trim();
  pages.push({ path, title, md });
}

const order = (p: string) => (p === "/" ? "0" : p.startsWith("/visas/") ? "3" + p : p.startsWith("/visas") ? "2" + p : p.startsWith("/your-route") ? "1" + p : "4" + p);
pages.sort((a, b) => order(a.path).localeCompare(order(b.path)));
const toc = pages.map((p) => `- [${p.title}](#${p.path === "/" ? "home" : p.path.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}) — \`${p.path}\``).join("\n");
const body = pages
  .map((p) => `<a id="${p.path === "/" ? "home" : p.path.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}"></a>\n\n# ${p.title}\n\n_Page: \`${p.path}\`_\n\n${p.md.replace(/^# .*\n+/, "")}`)
  .join("\n\n---\n\n");
const out = `# Global Talent UK — website content\n\nExported ${new Date().toISOString().slice(0, 10)} from the site (${pages.length} pages). Visa guide pages are drawn from GOV.UK's Content API (Open Government Licence v3.0).\n\n## Contents\n\n${toc}\n\n---\n\n${body}\n`;
await Bun.write(process.argv[2] ?? "WEBSITE_CONTENT.md", out);
console.log(pages.length, "pages", out.length, "chars");
console.log(pages.map((p) => p.path).join("\n"));
