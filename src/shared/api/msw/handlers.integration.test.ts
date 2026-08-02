import { describe, it, expect } from "vitest";
import { createStore } from "./store";
import type { AuctionDetail } from "@/shared/types";
import {
  createBet,
  rankBets,
  applyWinStatus,
  validateBetPrice,
} from "./bet-logic";
import { uuid } from "@/shared/lib";

function createMockAuction(
  overrides: Partial<AuctionDetail> = {}
): AuctionDetail {
  return {
    uuid: uuid(),
    cargo_num: "A24-0001",
    auc_type: "Up",
    status: "Active",
    load_city: "Москва",
    unload_city: "Казань",
    load_date: "2026-01-01",
    unload_date: "2026-01-10",
    cargo_name: "Мебель",
    cargo_weight: 5000,
    cargo_volume: 30,
    body_type: "Тент",
    current_price: 150000,
    price_per_km: 25,
    bet_step: 500,
    bidder_status: "NotParticipating",
    is_bet_present: false,
    primary_action: "make_bet",
    organizer: { name: "ООО Тест", inn: "123" },
    contacts: {
      phone: "+79991234567",
      email: "test@mail.ru",
      person: "Иванов А.А.",
    },
    route_points: [],
    cargo_requirements: null,
    payment_terms: null,
    trading: {
      can_set_bet: true,
      current_price: 150000,
      min_price: 100000,
      max_price: 200000,
      bet_step: 500,
      bidder_status: "NotParticipating",
    },
    hide_bets_history: false,
    hide_points_address_and_contacts: false,
    no_view_cargo_price: false,
    ...overrides,
  } as AuctionDetail;
}

describe("MSW store integration", () => {
  it("creates a bet and mutates store correctly", () => {
    const store = createStore();
    const auction = createMockAuction();
    store.auctions.set(auction.uuid, auction);
    store.bets.set(auction.uuid, []);

    const body = { price: 150500 };

    const betList = store.bets.get(auction.uuid)!;
    const newBet = createBet(body.price, "Вы");
    betList.push(newBet);

    const ranked = rankBets(betList, auction.auc_type);
    applyWinStatus(ranked, auction);

    expect(betList.length).toBe(1);
    expect(betList[0]!.carrier_name).toBe("Вы");
    expect(betList[0]!.is_winner).toBe(true);
    expect(betList[0]!.rank).toBe(1);
    expect(auction.current_price).toBe(150500);
    expect(auction.bidder_status).toBe("Leading");
    expect(auction.is_bet_present).toBe(true);
  });

  it("new bet does not become winner if existing bet is higher (Up auction)", () => {
    const store = createStore();
    const auction = createMockAuction();
    auction.trading.bidder_status = "Outbid";
    auction.bidder_status = "Outbid";
    auction.is_bet_present = true;
    store.auctions.set(auction.uuid, auction);

    const existingBet = createBet(160000, "Перевозчик-1");
    existingBet.rank = 1;
    existingBet.is_winner = true;

    store.bets.set(auction.uuid, [existingBet]);

    const betList = store.bets.get(auction.uuid)!;
    betList.push(createBet(150500, "Вы"));

    const ranked = rankBets(betList, auction.auc_type);
    applyWinStatus(ranked, auction);

    expect(betList.length).toBe(2);
    expect(ranked[0]!.carrier_name).toBe("Перевозчик-1");
    expect(ranked[0]!.is_winner).toBe(true);
    expect(ranked[1]!.carrier_name).toBe("Вы");
    expect(ranked[1]!.is_winner).toBe(false);
  });

  it("price validation rejects invalid min/max/step", () => {
    const auction = createMockAuction();
    auction.trading.min_price = 100000;
    auction.trading.max_price = 200000;
    auction.trading.bet_step = 500;

    const tooLow = { price: 50000 };
    expect(
      validateBetPrice(tooLow.price, {
        minPrice: auction.trading.min_price,
        maxPrice: auction.trading.max_price,
        betStep: auction.trading.bet_step,
      })
    ).toBe("Минимальная цена: 100000");

    const tooHigh = { price: 250000 };
    expect(
      validateBetPrice(tooHigh.price, {
        minPrice: auction.trading.min_price,
        maxPrice: auction.trading.max_price,
        betStep: auction.trading.bet_step,
      })
    ).toBe("Максимальная цена: 200000");

    const notStep = { price: 100250 };
    expect(
      validateBetPrice(notStep.price, {
        minPrice: auction.trading.min_price,
        maxPrice: auction.trading.max_price,
        betStep: auction.trading.bet_step,
      })
    ).toBe("Шаг ставки: 500");

    const valid = { price: 150000 };
    expect(
      validateBetPrice(valid.price, {
        minPrice: auction.trading.min_price,
        maxPrice: auction.trading.max_price,
        betStep: auction.trading.bet_step,
      })
    ).toBeNull();
  });

  it("handles Down auction ranking (lowest wins)", () => {
    const store = createStore();
    const auction = createMockAuction({ auc_type: "Down" });
    auction.trading.bidder_status = "NotParticipating";
    auction.bidder_status = "NotParticipating";
    auction.is_bet_present = false;
    store.auctions.set(auction.uuid, auction);

    store.bets.set(auction.uuid, []);
    const betList = store.bets.get(auction.uuid)!;
    betList.push(createBet(150000, "Перевозчик-1"), createBet(100000, "Вы"));

    const ranked = rankBets(betList, auction.auc_type);
    applyWinStatus(ranked, auction);

    expect(ranked[0]!.price).toBe(100000);
    expect(ranked[0]!.carrier_name).toBe("Вы");
    expect(ranked[0]!.is_winner).toBe(true);
  });
});
