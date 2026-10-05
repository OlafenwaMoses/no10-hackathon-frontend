import type { TalentCategory } from "@api-types";
import { TALENT_CATEGORY_LABELS } from "../lib/labels";
import Pill from "./UI/Pill";
import { CATEGORY_TONES } from "../lib/tones";

function CategoryTag({ category }: { category: TalentCategory }) {
  return <Pill tone={CATEGORY_TONES[category]}>{TALENT_CATEGORY_LABELS[category]}</Pill>;
}

export default CategoryTag;
