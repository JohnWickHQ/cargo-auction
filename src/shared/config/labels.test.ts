import { describe, it, expect } from "vitest";
import {
  actionLabels,
  auctionTypeLabels,
  auctionStatusLabels,
  bidderStatusLabels,
  formatPrice,
} from "@/shared/config";

describe("action labels", () => {
  it("maps make_bet to Russian", () => {
    expect(actionLabels.make_bet).toBe("Сделать ставку");
  });
  it("maps change_bet to Russian", () => {
    expect(actionLabels.change_bet).toBe("Изменить ставку");
  });
  it("maps view_bets to Russian", () => {
    expect(actionLabels.view_bets).toBe("Смотреть ставки");
  });
  it("maps disabled to Russian", () => {
    expect(actionLabels.disabled).toBe("Недоступно");
  });
});

describe("auction type labels", () => {
  it("labels all four auction types in Russian", () => {
    expect(auctionTypeLabels.Request).toBe("Заявка");
    expect(auctionTypeLabels.Up).toBe("Повышение");
    expect(auctionTypeLabels.Down).toBe("Понижение");
    expect(auctionTypeLabels.FixPrice).toBe("Фикс. цена");
  });
});

describe("auction status labels", () => {
  it("labels all four statuses in Russian", () => {
    expect(auctionStatusLabels.Active).toBe("Активен");
    expect(auctionStatusLabels.Completed).toBe("Завершён");
    expect(auctionStatusLabels.Cancelled).toBe("Отменён");
    expect(auctionStatusLabels.Draft).toBe("Черновик");
  });
});

describe("bidder status labels", () => {
  it("labels all five bidder statuses in Russian", () => {
    expect(bidderStatusLabels.Leading).toBe("Лидируете");
    expect(bidderStatusLabels.Losing).toBe("Проигрываете");
    expect(bidderStatusLabels.Winner).toBe("Победитель");
    expect(bidderStatusLabels.NotParticipating).toBe("Не участвуете");
    expect(bidderStatusLabels.Outbid).toBe("Перебита ставка");
  });
});

describe("formatPrice", () => {
  it("formats integer price with ₽", () => {
    expect(formatPrice(150000)).toBe("150\xa0000 ₽");
  });

  it("formats zero", () => {
    const result = formatPrice(0);
    expect(result).toMatch(/0\s?₽/);
  });

  it("groups thousands", () => {
    const result = formatPrice(1234567);
    expect(result).toMatch(/1\s?234\s?567/);
  });
});
