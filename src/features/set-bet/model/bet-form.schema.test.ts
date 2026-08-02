import { describe, it, expect } from "vitest";
import { createBetFormSchema } from "./bet-form.schema";

function simulateArrowClicks(
  start: number,
  step: number,
  clicks: number
): number {
  let value = start;
  for (let i = 0; i < clicks; i++) {
    value += step;
  }
  return value;
}

describe("createBetFormSchema", () => {
  describe("bet_step divisibility", () => {
    it("accepts a price that is an exact multiple of step", () => {
      const schema = createBetFormSchema({ bet_step: 50 });
      const result = schema.safeParse({ price: 10000 });
      expect(result.success).toBe(true);
    });

    it("accepts price after 200 arrow clicks (stress test)", () => {
      const schema = createBetFormSchema({ bet_step: 50 });
      const price = simulateArrowClicks(0, 50, 200);
      const result = schema.safeParse({ price });
      expect(result.success).toBe(true);
    });

    it("accepts price reached from a non-zero start via arrow clicks", () => {
      const schema = createBetFormSchema({ bet_step: 500 });
      const price = simulateArrowClicks(15000, 500, 5);
      expect(price).toBe(17500);
      const result = schema.safeParse({ price });
      expect(result.success).toBe(true);
    });

    it("rejects a price not divisible by step", () => {
      const schema = createBetFormSchema({ bet_step: 50 });
      const result = schema.safeParse({ price: 101 });
      expect(result.success).toBe(false);
    });

    it("rejects 0 or negative price", () => {
      const schema = createBetFormSchema({ bet_step: 50 });
      expect(schema.safeParse({ price: 0 }).success).toBe(false);
      expect(schema.safeParse({ price: -100 }).success).toBe(false);
    });
  });

  describe("min_price", () => {
    it("accepts price at min", () => {
      const schema = createBetFormSchema({ min_price: 10000, bet_step: 500 });
      const result = schema.safeParse({ price: 10000 });
      expect(result.success).toBe(true);
    });

    it("rejects price below min", () => {
      const schema = createBetFormSchema({ min_price: 10000, bet_step: 500 });
      const result = schema.safeParse({ price: 5000 });
      expect(result.success).toBe(false);
    });

    it("skips min check when min is null", () => {
      const schema = createBetFormSchema({ min_price: null, bet_step: 500 });
      const result = schema.safeParse({ price: 500 });
      expect(result.success).toBe(true);
    });

    it("skips min check when min is undefined", () => {
      const schema = createBetFormSchema({ bet_step: 500 });
      const result = schema.safeParse({ price: 500 });
      expect(result.success).toBe(true);
    });
  });

  describe("max_price", () => {
    it("accepts price at max", () => {
      const schema = createBetFormSchema({ max_price: 200000, bet_step: 1000 });
      const result = schema.safeParse({ price: 200000 });
      expect(result.success).toBe(true);
    });

    it("rejects price above max", () => {
      const schema = createBetFormSchema({ max_price: 200000, bet_step: 1000 });
      const result = schema.safeParse({ price: 250000 });
      expect(result.success).toBe(false);
    });

    it("skips max check when max is null", () => {
      const schema = createBetFormSchema({ max_price: null, bet_step: 500 });
      const result = schema.safeParse({ price: 1000000 });
      expect(result.success).toBe(true);
    });
  });

  describe("combined constraints", () => {
    it("accepts price within min-max range at step boundary", () => {
      const schema = createBetFormSchema({
        min_price: 10000,
        max_price: 50000,
        bet_step: 500,
      });
      const result = schema.safeParse({ price: 25000 });
      expect(result.success).toBe(true);
    });

    it("rejects price outside range", () => {
      const schema = createBetFormSchema({
        min_price: 10000,
        max_price: 50000,
        bet_step: 500,
      });
      expect(schema.safeParse({ price: 55000 }).success).toBe(false);
      expect(schema.safeParse({ price: 5000 }).success).toBe(false);
    });
  });
});
