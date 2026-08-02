import type {
  AuctionListRequest,
  AuctionListResponse,
  AuctionDetail,
} from "@/shared/types";

// eslint-disable-next-line complexity
export function filterAuctions(
  auctions: Map<string, AuctionDetail>,
  request: AuctionListRequest
): AuctionListResponse {
  const aucValues = Array.from(auctions.values());

  const filtered: AuctionDetail[] = [];
  for (const a of aucValues) {
    if (
      request.cargo_num &&
      !a.cargo_num.toLowerCase().includes(request.cargo_num.toLowerCase())
    )
      continue;
    if (request.status && a.status !== request.status) continue;
    if (
      request.statuses &&
      request.statuses.length > 0 &&
      !request.statuses.includes(a.status)
    )
      continue;
    if (request.auc_type && a.auc_type !== request.auc_type) continue;
    if (request.load_city && a.load_city !== request.load_city) continue;
    if (request.unload_city && a.unload_city !== request.unload_city) continue;
    if (
      request.load_date_from &&
      (!a.load_date || a.load_date < request.load_date_from)
    )
      continue;
    if (
      request.load_date_to &&
      (!a.load_date || a.load_date > request.load_date_to)
    )
      continue;
    if (
      request.is_available !== undefined &&
      (a.status === "Active") !== request.is_available
    )
      continue;
    if (
      request.is_bidder !== undefined &&
      a.is_bet_present !== request.is_bidder
    )
      continue;
    if (
      request.price_from !== undefined &&
      a.current_price < request.price_from
    )
      continue;
    if (request.price_to !== undefined && a.current_price > request.price_to)
      continue;

    filtered.push(a);
  }

  const total = filtered.length;
  const page = request.page ?? 1;
  const perPage = request.per_page ?? 20;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return {
    items: paginated.map((a) => ({
      uuid: a.uuid,
      cargo_num: a.cargo_num,
      auc_type: a.auc_type,
      status: a.status,
      load_city: a.load_city,
      unload_city: a.unload_city,
      load_date: a.load_date,
      unload_date: a.unload_date,
      cargo_name: a.cargo_name,
      cargo_weight: a.cargo_weight,
      cargo_volume: a.cargo_volume,
      body_type: a.body_type,
      current_price: a.current_price,
      price_per_km: a.price_per_km,
      bet_step: a.bet_step,
      bidder_status: a.bidder_status,
      is_bet_present: a.is_bet_present,
      primary_action: a.primary_action,
    })),
    total,
    page,
    per_page: perPage,
  };
}
