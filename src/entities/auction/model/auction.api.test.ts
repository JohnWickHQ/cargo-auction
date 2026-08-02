import { describe, it, expect } from "vitest";
import type { AuctionListRequest } from "@/shared/types";

describe("AuctionListRequest builder", () => {
  it("builds minimal request with defaults", () => {
    const request: AuctionListRequest = { page: 1, per_page: 20 };
    expect(request.page).toBe(1);
    expect(request.per_page).toBe(20);
    expect(request.cargo_num).toBeUndefined();
    expect(request.status).toBeUndefined();
  });

  it("builds request with cargo_num filter", () => {
    const request: AuctionListRequest = {
      page: 1,
      per_page: 20,
      cargo_num: "A24-0005",
    };
    expect(request.cargo_num).toBe("A24-0005");
  });

  it("builds request with status filter", () => {
    const request: AuctionListRequest = {
      page: 1,
      per_page: 20,
      status: "Active",
    };
    expect(request.status).toBe("Active");
  });

  it("builds request with statuses array", () => {
    const request: AuctionListRequest = {
      page: 1,
      per_page: 20,
      statuses: ["Active", "Completed"],
    };
    expect(request.statuses).toEqual(["Active", "Completed"]);
  });

  it("builds request with auction type", () => {
    const request: AuctionListRequest = {
      page: 1,
      per_page: 20,
      auc_type: "Up",
    };
    expect(request.auc_type).toBe("Up");
  });

  it("builds request with city filters", () => {
    const request: AuctionListRequest = {
      page: 1,
      per_page: 20,
      load_city: "Москва",
      unload_city: "Казань",
    };
    expect(request.load_city).toBe("Москва");
    expect(request.unload_city).toBe("Казань");
  });

  it("builds request with date range", () => {
    const request: AuctionListRequest = {
      page: 1,
      per_page: 20,
      load_date_from: "2026-01-01",
      load_date_to: "2026-12-31",
    };
    expect(request.load_date_from).toBe("2026-01-01");
    expect(request.load_date_to).toBe("2026-12-31");
  });

  it("builds request with boolean flags", () => {
    const request: AuctionListRequest = {
      page: 1,
      per_page: 20,
      is_available: true,
      is_bidder: false,
    };
    expect(request.is_available).toBe(true);
    expect(request.is_bidder).toBe(false);
  });

  it("builds request with price range", () => {
    const request: AuctionListRequest = {
      page: 1,
      per_page: 20,
      price_from: 5000,
      price_to: 100000,
    };
    expect(request.price_from).toBe(5000);
    expect(request.price_to).toBe(100000);
  });

  it("builds full request with all filters", () => {
    const request: AuctionListRequest = {
      page: 2,
      per_page: 10,
      cargo_num: "A24",
      status: "Active",
      statuses: ["Active", "Completed"],
      auc_type: "Request",
      load_city: "Москва",
      unload_city: "Казань",
      load_date_from: "2026-01-01",
      load_date_to: "2026-06-01",
      is_available: true,
      is_bidder: false,
      price_from: 5000,
      price_to: 100000,
    };
    expect(request.page).toBe(2);
    expect(request.per_page).toBe(10);
    expect(request.statuses).toContain("Active");
    expect(request.price_from).toBe(5000);
  });
});
