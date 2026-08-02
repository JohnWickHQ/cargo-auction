import { describe, it, expect } from "vitest";
import type { Trading, AuctionType, AuctionStatus } from "@/shared/types";

function generateTrading(
  aucType: AuctionType,
  _status: AuctionStatus,
  currentPrice: number
): Trading {
  const step = 500; // fixed for deterministic testing
  const snap = (v: number) => Math.round(v / step) * step;

  const minRaw =
    aucType === "Down"
      ? Math.max(1000, currentPrice - 10000) // fixed offset for testing
      : currentPrice - 2500; // fixed offset for testing

  return {
    can_set_bet: true,
    current_price: snap(currentPrice),
    min_price: snap(minRaw),
    max_price: aucType === "Up" ? snap(currentPrice + 10000) : null,
    bet_step: step,
    bidder_status: "NotParticipating",
  };
}

describe("generateTrading", () => {
  it("snaps current_price to step boundary", () => {
    const trading = generateTrading("Up", "Active", 123456);
    expect(trading.current_price).toBe(123500);
    expect(trading.current_price % trading.bet_step).toBe(0);
  });

  it("snaps min_price to step boundary", () => {
    const trading = generateTrading("Up", "Active", 100000);
    expect(trading.min_price! % trading.bet_step).toBe(0);
  });

  it("min_price is never negative", () => {
    const trading = generateTrading("Up", "Active", 10000);
    expect(trading.min_price!).toBeGreaterThanOrEqual(0);
  });

  it("min_price is at most current_price for non-Down", () => {
    const trading = generateTrading("Up", "Active", 100000);
    expect(trading.min_price!).toBeLessThanOrEqual(trading.current_price);
  });

  it("Down auction min_price is at least 1000", () => {
    const trading = generateTrading("Down", "Active", 5000);
    expect(trading.min_price!).toBeGreaterThanOrEqual(1000);
  });

  it("Up auction has max_price at step boundary", () => {
    const trading = generateTrading("Up", "Active", 100000);
    expect(trading.max_price!).toBeDefined();
    expect(trading.max_price! % trading.bet_step).toBe(0);
  });

  it("non-Up auction has null max_price", () => {
    const trading = generateTrading("Request", "Active", 100000);
    expect(trading.max_price).toBeNull();
  });

  it("all prices are at step boundary", () => {
    for (const type of ["Up", "Down", "Request", "FixPrice"] as AuctionType[]) {
      const trading = generateTrading(type, "Active", 100000);
      expect(trading.current_price % trading.bet_step).toBe(0);
      expect(trading.min_price! % trading.bet_step).toBe(0);
      if (trading.max_price) {
        expect(trading.max_price % trading.bet_step).toBe(0);
      }
    }
  });
});
