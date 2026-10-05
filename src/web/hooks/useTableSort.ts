import { useState } from "react";

export type SortDirection = "asc" | "desc";
export type TableSort<K extends string> = { key: K; direction: SortDirection };

type Options<K extends string> = {
  initial?: TableSort<K> | null;
  defaultDirection?: (key: K) => SortDirection;
};

export default function useTableSort<K extends string>(options?: Options<K>) {
  const [sort, setSort] = useState<TableSort<K> | null>(options?.initial ?? null);

  const toggleSort = (key: K) => {
    setSort((prev) => {
      const first = options?.defaultDirection?.(key) ?? "asc";
      if (prev?.key !== key) return { key, direction: first };
      if (prev.direction === first) {
        return { key, direction: first === "asc" ? "desc" : "asc" };
      }
      return null;
    });
  };

  return { sort, toggleSort };
}
