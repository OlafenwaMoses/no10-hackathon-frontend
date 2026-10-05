function escape(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function headerMatches(header: string, keyword: string) {
  return new RegExp(`(^|[^a-z])${escape(keyword)}([^a-z]|$)`).test(header);
}
