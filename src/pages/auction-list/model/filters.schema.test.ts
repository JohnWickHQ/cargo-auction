import { describe, it, expect } from "vitest";
import { auctionFiltersSchema } from "./filters.schema";

describe("auctionFiltersSchema", () => {
  it("parses empty search params with defaults", () => {
    const result = auctionFiltersSchema.safeParse({});
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ page: 1, per_page: 20 });
  });

  it("coerces string page to number", () => {
    const result = auctionFiltersSchema.safeParse({
      page: "3",
      per_page: "50",
    });
    expect(result.success).toBe(true);
    expect(result.data?.page).toBe(3);
    expect(result.data?.per_page).toBe(50);
  });

  it("falls back to defaults on invalid page", () => {
    const result = auctionFiltersSchema.safeParse({
      page: "abc",
      per_page: "-5",
    });
    expect(result.success).toBe(true);
    expect(result.data?.page).toBe(1);
    expect(result.data?.per_page).toBe(20);
  });

  it("parses cargo_num filter", () => {
    const result = auctionFiltersSchema.safeParse({ cargo_num: "A24-0001" });
    expect(result.success).toBe(true);
    expect(result.data?.cargo_num).toBe("A24-0001");
  });

  it("parses auction type filter", () => {
    const result = auctionFiltersSchema.safeParse({ auc_type: "Up" });
    expect(result.success).toBe(true);
    expect(result.data?.auc_type).toBe("Up");
  });

  it("parses status and statuses filters", () => {
    const result = auctionFiltersSchema.safeParse({
      status: "Active",
      statuses: ["Active", "Draft"],
    });
    expect(result.success).toBe(true);
    expect(result.data?.status).toBe("Active");
    expect(result.data?.statuses).toEqual(["Active", "Draft"]);
  });

  it("parses boolean-like enums", () => {
    const result = auctionFiltersSchema.safeParse({
      is_available: "true",
      is_bidder: "false",
    });
    expect(result.success).toBe(true);
    expect(result.data?.is_available).toBe("true");
    expect(result.data?.is_bidder).toBe("false");
  });

  it("ignores invalid boolean-like enum values", () => {
    const result = auctionFiltersSchema.safeParse({ is_available: "maybe" });
    expect(result.success).toBe(true);
    expect(result.data?.is_available).toBeUndefined();
  });

  it("parses date filter params", () => {
    const result = auctionFiltersSchema.safeParse({
      load_date_from: "2026-01-01",
      load_date_to: "2026-12-31",
    });
    expect(result.success).toBe(true);
    expect(result.data?.load_date_from).toBe("2026-01-01");
    expect(result.data?.load_date_to).toBe("2026-12-31");
  });

  it("coerces price filter strings to numbers", () => {
    const result = auctionFiltersSchema.safeParse({
      price_from: "1000",
      price_to: "50000",
    });
    expect(result.success).toBe(true);
    expect(result.data?.price_from).toBe(1000);
    expect(result.data?.price_to).toBe(50000);
  });

  it("handles all filters at once", () => {
    const result = auctionFiltersSchema.safeParse({
      page: "2",
      per_page: "10",
      cargo_num: "A24",
      status: "Active",
      statuses: ["Active", "Completed"],
      auc_type: "Up",
      load_city: "Москва",
      unload_city: "Казань",
      load_date_from: "2026-01-01",
      load_date_to: "2026-06-01",
      is_available: "true",
      is_bidder: "false",
      price_from: "5000",
      price_to: "100000",
    });
    expect(result.success).toBe(true);
    expect(result.data?.page).toBe(2);
    expect(result.data?.cargo_num).toBe("A24");
    expect(result.data?.price_from).toBe(5000);
  });
});
