import { GOVUK_ORIGIN } from "./constants";

const DROP_WITH_CONTENT = new Set([
  "script", "style", "iframe", "object", "embed", "form", "input", "button", "select", "textarea",
  "noscript", "template", "link", "meta", "img", "video", "audio", "source", "picture", "canvas",
]);

const KEEP = new Set([
  "p", "ul", "ol", "li", "a", "h2", "h3", "h4", "h5", "h6", "strong", "em", "b", "i", "abbr", "br",
  "span", "div", "blockquote", "code", "pre", "sup", "sub", "dl", "dt", "dd", "hr", "svg", "path",
  "table", "caption", "thead", "tbody", "tfoot", "tr", "th", "td",
]);

const GLOBAL_ATTRIBUTES = new Set(["id", "title", "aria-label", "aria-hidden", "role"]);

const TAG_ATTRIBUTES: Record<string, Set<string>> = {
  a: new Set(["href", "rel"]),
  th: new Set(["scope", "colspan", "rowspan"]),
  td: new Set(["colspan", "rowspan"]),
  svg: new Set(["xmlns", "width", "height", "viewbox", "focusable"]),
  path: new Set(["d", "fill"]),
};

const TAG_CLASSES: Record<string, string> = {
  h2: "govuk-heading-m",
  h3: "govuk-heading-s",
  h4: "govuk-heading-s",
  p: "govuk-body",
  ul: "govuk-list govuk-list--bullet",
  ol: "govuk-list govuk-list--number",
  a: "govuk-link",
  table: "govuk-table",
  caption: "govuk-table__caption govuk-table__caption--m",
  thead: "govuk-table__head",
  tbody: "govuk-table__body",
  tr: "govuk-table__row",
  th: "govuk-table__header",
  td: "govuk-table__cell",
};

const absoluteHref = (href: string) => {
  const trimmed = href.trim();
  if (trimmed.startsWith("#")) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) return `${GOVUK_ORIGIN}${trimmed}`;
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return null;
};

const classFor = (tag: string, original: string) => {
  if (tag === "a" && original.includes("govuk-button--start")) return "govuk-button govuk-button--start";
  if (tag === "svg" && original.includes("govuk-button__start-icon")) return "govuk-button__start-icon";
  if (tag === "div" && original.includes("application-notice")) return "govuk-inset-text";
  if (tag === "div" && original.includes("example")) return "govuk-inset-text gtuk-example";
  return TAG_CLASSES[tag] ?? null;
};

const cleanElement = (element: Element) => {
  const tag = element.tagName.toLowerCase();
  if (DROP_WITH_CONTENT.has(tag)) {
    element.remove();
    return;
  }
  if (!KEEP.has(tag)) {
    element.removeAndKeepContent();
    return;
  }
  const original = element.getAttribute("class") ?? "";
  const allowed = TAG_ATTRIBUTES[tag];
  const names = Array.from(element.attributes, (attribute) => (attribute[0] ?? "").toLowerCase());
  for (const name of names) {
    if (!GLOBAL_ATTRIBUTES.has(name) && !allowed?.has(name)) element.removeAttribute(name);
  }
  const mapped = classFor(tag, original);
  if (mapped) element.setAttribute("class", mapped);
  if (tag === "a") {
    const href = absoluteHref(element.getAttribute("href") ?? "");
    if (href) element.setAttribute("href", href);
    else element.removeAttribute("href");
  }
};

export const sanitiseHtml = async (html: string) => {
  const rewriter = new HTMLRewriter()
    .on("*", { element: cleanElement })
    .onDocument({
      comments: (comment) => {
        comment.remove();
      },
    });
  const output = await rewriter.transform(new Response(html)).text();
  return output.replace(/\n{3,}/g, "\n\n").trim();
};
