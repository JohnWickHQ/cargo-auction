import type { AuctionFilters } from "./filters.schema";
import type { AuctionListRequest } from "@/shared/types";

// eslint-disable-next-line complexity
export function filtersToRequestParams(
  filters: AuctionFilters
): AuctionListRequest {
  const params: AuctionListRequest = {
    page: filters.page ?? 1,
    per_page: filters.per_page ?? 20,
  };
  if (filters.cargo_num !== undefined) params.cargo_num = filters.cargo_num;
  if (filters.status !== undefined) params.status = filters.status;
  if (filters.statuses !== undefined) params.statuses = filters.statuses;
  if (filters.auc_type !== undefined) params.auc_type = filters.auc_type;
  if (filters.load_city !== undefined) params.load_city = filters.load_city;
  if (filters.unload_city !== undefined)
    params.unload_city = filters.unload_city;
  if (filters.load_date_from !== undefined)
    params.load_date_from = filters.load_date_from;
  if (filters.load_date_to !== undefined)
    params.load_date_to = filters.load_date_to;
  if (filters.price_from !== undefined) params.price_from = filters.price_from;
  if (filters.price_to !== undefined) params.price_to = filters.price_to;
  if (filters.is_available !== undefined)
    params.is_available = filters.is_available === "true";
  if (filters.is_bidder !== undefined)
    params.is_bidder = filters.is_bidder === "true";
  return params;
}
