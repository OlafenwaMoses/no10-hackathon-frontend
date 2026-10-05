import type { InboundPayload } from "./inbound-payload";

export const sendToTalentDatabase = async (env: CloudflareBindings, payload: InboundPayload) => {
  if (!env.INBOUND_SECRET) {
    console.error("INBOUND_SECRET is not configured");
    return false;
  }
  try {
    const response = await fetch(`${env.TALENT_API_URL}/api/inbound`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-inbound-secret": env.INBOUND_SECRET },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    if (response.ok) return true;
    console.error(`Talent database returned ${response.status}: ${await response.text()}`);
    return false;
  } catch (error) {
    console.error("Talent database request failed", error);
    return false;
  }
};
