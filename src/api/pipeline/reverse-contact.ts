import type { LinkedInProfile } from "../types";
import { sleep } from "./retry";

const RC_URL = "https://api.reversecontact.com";
const POLL_INTERVAL_MS = 5_000;
const POLL_MAX_MS = 180_000;

type RcDates = { start?: string | null; end?: string | null } | null;

type RcPosition = {
  title?: string | null;
  companyName?: string | null;
  description?: string | null;
  startEndDate?: RcDates;
};

type RcPerson = {
  memberId?: string | null;
  publicId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  headline?: string | null;
  summary?: string | null;
  photoUrl?: string | null;
  followersCount?: number | null;
  location?: { city?: string | null; state?: string | null; country?: string | null; countryCode?: string | null } | null;
  experience?: RcPosition[] | null;
  education?: {
    schoolName?: string | null;
    degreeName?: string | null;
    fieldOfStudy?: string | null;
    startEndDate?: RcDates;
  }[] | null;
  languages?: { language?: string | null }[] | null;
  skills?: string[] | null;
};

type RcEnvelope<T> = { success?: boolean; data?: T; error?: { message?: string } };

type RcWebhook = { status?: string; result?: RcPerson; errorCode?: string };

async function rcRequest<T>(apiKey: string, path: string, init?: { body: unknown }) {
  const response = await fetch(`${RC_URL}${path}`, {
    method: init ? "POST" : "GET",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: init ? JSON.stringify(init.body) : undefined,
  });
  if (!response.ok) throw new Error(`Reverse Contact ${path} failed (${response.status}): ${(await response.text()).slice(0, 500)}`);
  const payload = (await response.json()) as RcEnvelope<T>;
  return payload.success ? (payload.data ?? null) : null;
}

function toProfile(person: RcPerson | null): LinkedInProfile | null {
  if (!person || (!person.firstName && !person.publicId)) return null;
  const location = person.location;
  return {
    memberId: person.memberId ?? null,
    publicId: person.publicId ?? null,
    profileUrl: person.publicId ? `https://www.linkedin.com/in/${person.publicId}` : null,
    firstName: person.firstName ?? null,
    lastName: person.lastName ?? null,
    headline: person.headline ?? null,
    summary: person.summary ?? null,
    photoUrl: person.photoUrl ?? null,
    followersCount: person.followersCount ?? null,
    location: [location?.city, location?.state, location?.country].filter(Boolean).join(", ") || null,
    countryCode: location?.countryCode ?? null,
    positions: (person.experience ?? []).map((position) => ({
      title: position.title ?? null,
      company: position.companyName ?? null,
      description: position.description ?? null,
      start: position.startEndDate?.start ?? null,
      end: position.startEndDate?.end ?? null,
    })),
    education: (person.education ?? []).map((item) => ({
      school: item.schoolName ?? null,
      degree: item.degreeName ?? null,
      fieldOfStudy: item.fieldOfStudy ?? null,
      start: item.startEndDate?.start ?? null,
      end: item.startEndDate?.end ?? null,
    })),
    languages: (person.languages ?? []).map((item) => item.language ?? "").filter(Boolean),
    skills: person.skills ?? [],
  };
}

export async function fetchLinkedInProfile(apiKey: string, linkedinUrl: string) {
  return toProfile(await rcRequest<RcPerson>(apiKey, "/v2/fetch/persons", { body: { url: linkedinUrl } }));
}

export async function resolveLinkedInProfileByName(
  apiKey: string,
  person: { firstName: string; lastName: string; companyName: string | null },
) {
  const triggered = await rcRequest<{ webhookId?: string }>(apiKey, "/v2/resolve/persons/name", {
    body: {
      firstName: person.firstName,
      lastName: person.lastName,
      ...(person.companyName ? { companyName: person.companyName } : {}),
    },
  });
  if (!triggered?.webhookId) return null;

  const deadline = Date.now() + POLL_MAX_MS;
  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);
    const webhook = await rcRequest<RcWebhook>(apiKey, `/v2/webhooks/${triggered.webhookId}`);
    if (webhook?.status === "succeeded") return toProfile(webhook.result ?? null);
    if (webhook?.status === "errored") return null;
  }
  throw new Error(`Reverse Contact resolve timed out (${triggered.webhookId})`);
}
