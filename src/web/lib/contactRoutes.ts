import type { Icon } from "@phosphor-icons/react";
import { EnvelopeIcon, GlobeIcon, LinkedinLogoIcon, PhoneIcon, XLogoIcon } from "@phosphor-icons/react";
import type { ContactDetails } from "@api-types";

export type ContactRoute = {
  key: string;
  icon: Icon;
  label: string;
  value: string;
  href: string;
  external: boolean;
};

function displayUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function withProtocol(url: string) {
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}

function twitterUrl(handle: string) {
  if (/^https?:\/\//.test(handle) || handle.includes(".com/")) return withProtocol(handle);
  return `https://x.com/${handle.replace(/^@/, "")}`;
}

function twitterLabel(handle: string) {
  if (!/^https?:\/\//.test(handle) && !handle.includes(".com/")) return handle.startsWith("@") ? handle : `@${handle}`;
  const path = displayUrl(handle).split("/")[1];
  return path ? `@${path}` : displayUrl(handle);
}

export default function contactRoutes(profileUrl: string | null, contact: ContactDetails | null): ContactRoute[] {
  const routes: ContactRoute[] = [];
  const seen = new Set<string>();
  const addUrl = (key: string, icon: Icon, label: string, url: string) => {
    const href = withProtocol(url);
    const normalised = displayUrl(href).toLowerCase();
    if (seen.has(normalised)) return;
    seen.add(normalised);
    routes.push({ key, icon, label, value: displayUrl(href), href, external: true });
  };

  if (profileUrl) {
    const linkedin = profileUrl.includes("linkedin.com");
    addUrl("profile", linkedin ? LinkedinLogoIcon : GlobeIcon, linkedin ? "LinkedIn" : "Profile", profileUrl);
  }
  if (!contact) return routes;

  if (contact.linkedinUrl) addUrl("linkedin", LinkedinLogoIcon, "LinkedIn", contact.linkedinUrl);
  for (const email of contact.emails) {
    routes.push({ key: `email-${email}`, icon: EnvelopeIcon, label: "Email", value: email, href: `mailto:${email}`, external: false });
  }
  for (const phone of contact.phones) {
    routes.push({
      key: `phone-${phone}`,
      icon: PhoneIcon,
      label: "Phone",
      value: phone,
      href: `tel:${phone.replace(/[^\d+]/g, "")}`,
      external: false,
    });
  }
  if (contact.website) addUrl("website", GlobeIcon, "Website", contact.website);
  if (contact.twitter) {
    const href = twitterUrl(contact.twitter);
    routes.push({ key: "twitter", icon: XLogoIcon, label: "X / Twitter", value: twitterLabel(contact.twitter), href, external: true });
  }
  return routes;
}
