import { describe, it, expect } from "vitest";
import { auctionFiltersSchema } from "./filters.schema";

describe("auctionFiltersSchema.filterSync", () => {
  it("parses URL search params from string", () => {
    const params = new URLSearchParams(
      "page=2&per_page=10&cargo_num=A24&status=Active"
    );
    const raw: Record<string, unknown> = {};
    params.forEach((v, k) => {
      raw[k] = v;
    });

    const result = auctionFiltersSchema.safeParse(raw);
    expect(result.success).toBe(true);
    expect(result.data!.page).toBe(2);
    expect(result.data!.per_page).toBe(10);
    expect(result.data!.cargo_num).toBe("A24");
    expect(result.data!.status).toBe("Active");
  });

  it("returns defaults when URL has garbage", () => {
    const result = auctionFiltersSchema.safeParse({ page: "notanumber" });
    expect(result.success).toBe(true);
    expect(result.data!.page).toBe(1);
    expect(result.data!.per_page).toBe(20);
  });

  it("merge updates preserve existing filters", () => {
    const existing = {
      page: 1,
      per_page: 20,
      cargo_num: "A24",
      status: "Active",
    };
    const parsed = auctionFiltersSchema.safeParse(existing);
    expect(parsed.success).toBe(true);

    const merged = { ...parsed.data!, page: 2 };
    expect(merged.page).toBe(2);
    expect(merged.cargo_num).toBe("A24");
    expect(merged.status).toBe("Active");
  });

  it("replace updates clear existing filters", () => {
    const empty = { page: 1, per_page: 20 };
    const parsed = auctionFiltersSchema.safeParse(empty);
    expect(parsed.success).toBe(true);
    expect(parsed.data!.cargo_num).toBeUndefined();
    expect(parsed.data!.status).toBeUndefined();
    expect(parsed.data!.page).toBe(1);
  });
});
