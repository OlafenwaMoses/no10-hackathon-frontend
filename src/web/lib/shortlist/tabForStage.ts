import type { ShortlistStage } from "@api-types";
import type { ShortlistTab } from "./shortlistTabs";

export default function tabForStage(stage: ShortlistStage): ShortlistTab {
  if (stage === "closed") return "closed";
  if (stage === "failed") return "failed";
  return "active";
}
