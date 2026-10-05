import type { Intent } from "./options";

export type InboundPayload = {
  name: string;
  email: string;
  phone?: string;
  organisation?: string;
  role?: string;
  profileUrl?: string;
  country?: string;
  category?: string;
  sector?: string;
  intent?: Intent;
  timeline?: string;
  message?: string;
};
