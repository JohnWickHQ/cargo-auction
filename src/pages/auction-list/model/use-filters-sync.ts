import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { auctionFiltersSchema, type AuctionFilters } from "./filters.schema";

/** @public — exported for unit testing */
export function parseFilters(raw: unknown): AuctionFilters {
  const parsed = auctionFiltersSchema.safeParse(raw ?? {});
  return parsed.success ? parsed.data : { page: 1, per_page: 20 };
}

export function useFiltersSync(): [
  AuctionFilters,
  (updates: Partial<AuctionFilters>, mode?: "merge" | "replace") => void,
] {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();

  const filters = useMemo(() => parseFilters(search), [search]);

  const setFilters = (
    updates: Partial<AuctionFilters>,
    mode?: "merge" | "replace"
  ) => {
    if (mode === "replace") {
      void navigate({ to: ".", search: updates, replace: true });
    } else {
      void navigate({
        to: ".",
        search: (prev: unknown) => {
          const base = parseFilters(prev);
          return { ...base, ...updates };
        },
        replace: true,
      });
    }
  };

  return [filters, setFilters];
}
