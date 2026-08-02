import { describe, it, expect } from "vitest";
import { rankBets, createBet } from "./bet-logic";

describe("bet ranking", () => {
  it("highest bid wins in Up auction", () => {
    const bets = [
      createBet(50000, "Перевозчик-1"),
      createBet(70000, "Перевозчик-2"),
      createBet(60000, "Вы"),
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
      createBet(50000, "Перевозчик-1"),
      createBet(70000, "Перевозчик-2"),
      createBet(45000, "Вы"),
    ];
    const ranked = rankBets(bets, "Down");

    expect(ranked[0]!.price).toBe(45000);
    expect(ranked[0]!.carrier_name).toBe("Вы");
    expect(ranked[0]!.is_winner).toBe(true);
    expect(ranked[0]!.rank).toBe(1);
  });

  it("new lower bid does not beat existing higher bid in Up auction", () => {
    const bets = [
      createBet(100000, "Перевозчик-4"),
      createBet(87500, "Вы"),
      createBet(87000, "Вы"),
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
    const cancelled = createBet(50000);
    cancelled.is_cancelled = true;
    const valid = createBet(40000);
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
