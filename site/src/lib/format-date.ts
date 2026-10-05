const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/London",
});

export const formatDate = (iso: string) => (iso ? DATE_FORMAT.format(new Date(iso)) : "Unknown");
