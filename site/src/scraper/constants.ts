export const GOVUK_ORIGIN = "https://www.gov.uk";

export const USER_AGENT =
  "GlobalTalentUK-prototype/0.1 (hackathon prototype for the Global Talent Taskforce; refreshes a few guides every 6 hours)";

export const MAX_CHANGES = 20;

export const STALE_AFTER_MS = 6 * 60 * 60 * 1000;

export const guideKey = (basePath: string) => `guide:${basePath}`;

export const changesKey = (basePath: string) => `guide:${basePath}:changes`;
