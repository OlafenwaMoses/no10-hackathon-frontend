import type { SearchCategoryChoice } from "@api-types";
import { ALL, ALL_CATEGORIES_LABEL } from "../lib/labels";
import Pill from "./UI/Pill";
import CategoryTag from "./CategoryTag";

function SearchCategoryTag({ category }: { category: SearchCategoryChoice }) {
  if (category === ALL) return <Pill variant="outline">{ALL_CATEGORIES_LABEL}</Pill>;
  return <CategoryTag category={category} />;
}

export default SearchCategoryTag;
