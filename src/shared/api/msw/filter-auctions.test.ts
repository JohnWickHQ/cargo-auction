import { describe, it, expect } from "vitest";
import type {
  AuctionListRequest,
  AuctionListResponse,
  AuctionDetail,
} from "@/shared/types";

// eslint-disable-next-line complexity
function filterAuctions(
  auctions: AuctionDetail[],
  request: AuctionListRequest
): AuctionListResponse {
  let items = [...auctions];

  if (request.cargo_num) {
    const num = request.cargo_num.toLowerCase();
    items = items.filter((a) => a.cargo_num.toLowerCase().includes(num));
  }
  if (request.status) {
    items = items.filter((a) => a.status === request.status);
  }
  if (request.statuses && request.statuses.length > 0) {
    items = items.filter((a) => request.statuses!.includes(a.status));
  }
  if (request.auc_type) {
    items = items.filter((a) => a.auc_type === request.auc_type);
  }
  if (request.load_city) {
    items = items.filter((a) => a.load_city === request.load_city);
  }
  if (request.unload_city) {
    items = items.filter((a) => a.unload_city === request.unload_city);
  }
  if (request.load_date_from) {
    items = items.filter(
      (a) => a.load_date && a.load_date >= request.load_date_from!
    );
  }
  if (request.load_date_to) {
    items = items.filter(
      (a) => a.load_date && a.load_date <= request.load_date_to!
    );
  }
  if (request.is_available !== undefined) {
    items = items.filter(
      (a) => (a.status === "Active") === request.is_available
    );
  }
  if (request.is_bidder !== undefined) {
    items = items.filter((a) => a.is_bet_present === request.is_bidder);
  }
  if (request.price_from !== undefined) {
    items = items.filter((a) => a.current_price >= request.price_from!);
  }
  if (request.price_to !== undefined) {
    items = items.filter((a) => a.current_price <= request.price_to!);
  }

  const total = items.length;
  const page = request.page ?? 1;
  const perPage = request.per_page ?? 20;
  const start = (page - 1) * perPage;
  const paginated = items.slice(start, start + perPage);

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

const mockAuctions: AuctionDetail[] = [
  {
    uuid: "1",
    cargo_num: "A24-0001",
    auc_type: "Up",
    status: "Active",
    load_city: "Москва",
    unload_city: "Казань",
    load_date: "2026-01-15",
    unload_date: "2026-01-20",
    cargo_name: "Мебель",
    cargo_weight: 5000,
    cargo_volume: 30,
    body_type: "Тент",
    current_price: 150000,
    price_per_km: 25,
    bet_step: 500,
    bidder_status: "Leading",
    is_bet_present: true,
    primary_action: "change_bet",
    organizer: { name: "ООО Тест", inn: "123" },
    contacts: null,
    route_points: [],
    cargo_requirements: null,
    payment_terms: null,
    trading: {
      can_set_bet: true,
      current_price: 150000,
      min_price: 100000,
      max_price: 200000,
      bet_step: 500,
      bidder_status: "Leading",
    },
    hide_bets_history: false,
    hide_points_address_and_contacts: false,
    no_view_cargo_price: false,
  } as AuctionDetail,
  {
    uuid: "2",
    cargo_num: "A24-0002",
    auc_type: "Down",
    status: "Completed",
    load_city: "Казань",
    unload_city: "Москва",
    load_date: "2026-02-01",
    unload_date: "2026-02-05",
    cargo_name: "Текстиль",
    cargo_weight: 2000,
    cargo_volume: 15,
    body_type: "Рефрижератор",
    current_price: 80000,
    price_per_km: 15,
    bet_step: 100,
    bidder_status: "NotParticipating",
    is_bet_present: false,
    primary_action: "make_bet",
    organizer: { name: "ООО Тест2", inn: "456" },
    contacts: null,
    route_points: [],
    cargo_requirements: null,
    payment_terms: null,
    trading: {
      can_set_bet: true,
      current_price: 80000,
      min_price: 50000,
      max_price: null,
      bet_step: 100,
      bidder_status: "NotParticipating",
    },
    hide_bets_history: false,
    hide_points_address_and_contacts: false,
    no_view_cargo_price: false,
  } as AuctionDetail,
  {
    uuid: "3",
    cargo_num: "A24-0003",
    auc_type: "Request",
    status: "Draft",
    load_city: "Москва",
    unload_city: "Казань",
    load_date: "2026-03-01",
    unload_date: "2026-03-10",
    cargo_name: "Металл",
    cargo_weight: 10000,
    cargo_volume: 50,
    body_type: "Борт",
    current_price: 200000,
    price_per_km: 30,
    bet_step: 1000,
    bidder_status: "Winner",
    is_bet_present: true,
    primary_action: "view_bets",
    organizer: { name: "ООО Тест3", inn: "789" },
    contacts: null,
    route_points: [],
    cargo_requirements: null,
    payment_terms: null,
    trading: {
      can_set_bet: false,
      current_price: 200000,
      min_price: 150000,
      max_price: 250000,
      bet_step: 1000,
      bidder_status: "Winner",
    },
    hide_bets_history: false,
    hide_points_address_and_contacts: false,
    no_view_cargo_price: false,
  } as AuctionDetail,
];

describe("filterAuctions", () => {
  it("returns all auctions with no filters", () => {
    const result = filterAuctions(mockAuctions, { page: 1, per_page: 20 });
    expect(result.total).toBe(3);
    expect(result.items).toHaveLength(3);
  });

  it("filters by cargo_num substring", () => {
    const result = filterAuctions(mockAuctions, {
      page: 1,
      per_page: 20,
      cargo_num: "A24-0001",
    });
    expect(result.total).toBe(1);
    expect(result.items[0]!.cargo_num).toBe("A24-0001");
  });

  it("filters by status", () => {
    const result = filterAuctions(mockAuctions, {
      page: 1,
      per_page: 20,
      status: "Active",
    });
    expect(result.total).toBe(1);
    expect(result.items[0]!.status).toBe("Active");
  });

  it("filters by statuses array", () => {
    const result = filterAuctions(mockAuctions, {
      page: 1,
      per_page: 20,
      statuses: ["Active", "Completed"],
    });
    expect(result.total).toBe(2);
  });

  it("filters by auc_type", () => {
    const result = filterAuctions(mockAuctions, {
      page: 1,
      per_page: 20,
      auc_type: "Down",
    });
    expect(result.total).toBe(1);
    expect(result.items[0]!.auc_type).toBe("Down");
  });

  it("filters by load_city", () => {
    const result = filterAuctions(mockAuctions, {
      page: 1,
      per_page: 20,
      load_city: "Москва",
    });
    expect(result.total).toBe(2);
  });

  it("filters by unload_city", () => {
    const result = filterAuctions(mockAuctions, {
      page: 1,
      per_page: 20,
      unload_city: "Казань",
    });
    expect(result.total).toBe(2);
  });

  it("filters by load_date_from", () => {
    const result = filterAuctions(mockAuctions, {
      page: 1,
      per_page: 20,
      load_date_from: "2026-02-01",
    });
    expect(result.total).toBe(2);
    expect(result.items.map((i) => i.cargo_num)).toEqual([
      "A24-0002",
      "A24-0003",
    ]);
  });

  it("filters by load_date_to", () => {
    const result = filterAuctions(mockAuctions, {
      page: 1,
      per_page: 20,
      load_date_to: "2026-01-31",
    });
    expect(result.total).toBe(1);
    expect(result.items[0]!.cargo_num).toBe("A24-0001");
  });

  it("filters by is_available=true", () => {
    const result = filterAuctions(mockAuctions, {
      page: 1,
      per_page: 20,
      is_available: true,
    });
    expect(result.total).toBe(1);
    expect(result.items[0]!.status).toBe("Active");
  });

  it("filters by is_available=false", () => {
    const result = filterAuctions(mockAuctions, {
      page: 1,
      per_page: 20,
      is_available: false,
    });
    expect(result.total).toBe(2);
  });

  it("filters by is_bidder", () => {
    const result = filterAuctions(mockAuctions, {
      page: 1,
      per_page: 20,
      is_bidder: true,
    });
    expect(result.total).toBe(2);
    result.items.forEach((item) => expect(item.is_bet_present).toBe(true));
  });

  it("filters by price_from", () => {
    const result = filterAuctions(mockAuctions, {
      page: 1,
      per_page: 20,
      price_from: 150000,
    });
    expect(result.total).toBe(2);
  });

  it("filters by price_to", () => {
    const result = filterAuctions(mockAuctions, {
      page: 1,
      per_page: 20,
      price_to: 100000,
    });
    expect(result.total).toBe(1);
    expect(result.items[0]!.cargo_num).toBe("A24-0002");
  });

  it("supports pagination", () => {
    const result = filterAuctions(mockAuctions, { page: 1, per_page: 2 });
    expect(result.total).toBe(3);
    expect(result.items).toHaveLength(2);
    expect(result.page).toBe(1);
  });

  it("returns empty on out-of-range page", () => {
    const result = filterAuctions(mockAuctions, { page: 5, per_page: 20 });
    expect(result.total).toBe(3);
    expect(result.items).toHaveLength(0);
  });
});
