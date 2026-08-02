import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { auctionFiltersSchema, type AuctionFilters } from "./filters.schema";

export function useFiltersSync(): [
  AuctionFilters,
  (updates: Partial<AuctionFilters>, mode?: "merge" | "replace") => void,
] {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const parsed = useMemo(
    () => auctionFiltersSchema.safeParse(search ?? {}),
    [search]
  );
  const filters: AuctionFilters = parsed.success
    ? parsed.data
    : { page: 1, per_page: 20 };

  const setFilters = (
    updates: Partial<AuctionFilters>,
    mode?: "merge" | "replace"
  ) => {
    if (mode === "replace") {
      void navigate({ to: ".", search: updates, replace: true });
    } else {
      void navigate({
        to: ".",
        search: (prev) => {
          const prevParsed = auctionFiltersSchema.safeParse(prev ?? {});
          const base: AuctionFilters = prevParsed.success
            ? prevParsed.data
            : { page: 1, per_page: 20 };
          return { ...base, ...updates };
        },
        replace: true,
      });
    }
  };

  return [filters, setFilters];
}
