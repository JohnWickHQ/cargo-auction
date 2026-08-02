import { describe, it, expect } from "vitest";
import type { Bet } from "@/shared/types";
import { VAT_RATE } from "@/shared/config";

function rankBets(bets: Bet[], aucType: string): Bet[] {
  const isUp = aucType === "Up" || aucType === "Request";
  const sorted = [...bets].sort((a, b) =>
    isUp ? b.price - a.price : a.price - b.price
  );

  let rank = 0;
  sorted.forEach((b) => {
    b.is_winner = false;
    b.rank = b.is_cancelled ? null : ++rank;
  });

  const winner = sorted.find((b) => !b.is_cancelled);
  if (winner) winner.is_winner = true;

  return sorted;
}

function makeBet(price: number, carrier = "Перевозчик-1"): Bet {
  return {
    uuid: crypto.randomUUID(),
    price,
    price_with_vat: Math.round(price * (1 + VAT_RATE)),
    price_without_vat: price,
    carrier_name: carrier,
    rank: 0,
    is_winner: false,
    is_cancelled: false,
    cancel_reason: null,
    created_at: new Date().toISOString(),
  };
}

describe("bet ranking", () => {
  it("highest bid wins in Up auction", () => {
    const bets = [
      makeBet(50000, "Перевозчик-1"),
      makeBet(70000, "Перевозчик-2"),
      makeBet(60000, "Вы"),
    ];
    const ranked = rankBets(bets, "Up");

    expect(ranked[0]!.price).toBe(70000);
    expect(ranked[0]!.carrier_name).toBe("Перевозчик-2");
    expect(ranked[0]!.is_winner).toBe(true);
    expect(ranked[0]!.rank).toBe(1);

    expect(ranked[1]!.price).toBe(60000);
    expect(ranked[1]!.is_winner).toBe(false);
    expect(ranked[1]!.rank).toBe(2);
  });

  it("lowest bid wins in Down auction", () => {
    const bets = [
      makeBet(50000, "Перевозчик-1"),
      makeBet(70000, "Перевозчик-2"),
      makeBet(45000, "Вы"),
    ];
    const ranked = rankBets(bets, "Down");

    expect(ranked[0]!.price).toBe(45000);
    expect(ranked[0]!.carrier_name).toBe("Вы");
    expect(ranked[0]!.is_winner).toBe(true);
    expect(ranked[0]!.rank).toBe(1);
  });

  it("new lower bid does not beat existing higher bid in Up auction", () => {
    const bets = [
      makeBet(100000, "Перевозчик-4"),
      makeBet(87500, "Вы"),
      makeBet(87000, "Вы"),
    ];
    const ranked = rankBets(bets, "Up");

    expect(ranked[0]!.price).toBe(100000);
    expect(ranked[0]!.carrier_name).toBe("Перевозчик-4");
    expect(ranked[0]!.is_winner).toBe(true);

    const ourBets = ranked.filter((b) => b.carrier_name === "Вы");
    for (const b of ourBets) {
      expect(b.is_winner).toBe(false);
    }
  });

  it("cancelled bets do not become winner", () => {
    const cancelled = makeBet(50000);
    cancelled.is_cancelled = true;
    const valid = makeBet(40000);
    const ranked = rankBets([cancelled, valid], "Up");

    expect(ranked[0]!.price).toBe(50000);
    expect(ranked[0]!.is_cancelled).toBe(true);
    expect(ranked[0]!.is_winner).toBe(false);
    expect(ranked[0]!.rank).toBeNull();

    expect(ranked[1]!.price).toBe(40000);
    expect(ranked[1]!.is_winner).toBe(true);
    expect(ranked[1]!.rank).toBe(1);
  });
});
