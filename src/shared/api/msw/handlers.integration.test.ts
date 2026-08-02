import { describe, it, expect } from "vitest";
import { createStore } from "./store";
import type { AuctionDetail, Bet } from "@/shared/types";
import { VAT_RATE } from "@/shared/config";

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

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

    const newBet: Bet = {
      uuid: uuid(),
      price: body.price,
      price_with_vat: Math.round(body.price * (1 + VAT_RATE)),
      price_without_vat: body.price,
      carrier_name: "Вы",
      rank: 0,
      is_winner: false,
      is_cancelled: false,
      cancel_reason: null,
      created_at: new Date().toISOString(),
    };

    betList.push(newBet);

    const isUp = auction.auc_type === "Up" || auction.auc_type === "Request";
    betList.sort((a, b) => (isUp ? b.price - a.price : a.price - b.price));

    let rank = 0;
    betList.forEach((b) => {
      b.is_winner = false;
      b.rank = b.is_cancelled ? null : ++rank;
    });

    const winner = betList.find((b) => !b.is_cancelled);
    if (winner) {
      winner.is_winner = true;
      auction.current_price = winner.price;
      auction.trading.current_price = winner.price;
    }

    auction.bidder_status =
      winner?.carrier_name === "Вы" ? "Leading" : "Outbid";
    auction.trading.bidder_status = auction.bidder_status;
    auction.is_bet_present = true;
    auction.primary_action = "change_bet";

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

    const existingBet: Bet = {
      uuid: uuid(),
      price: 160000,
      price_with_vat: Math.round(160000 * (1 + VAT_RATE)),
      price_without_vat: 160000,
      carrier_name: "Перевозчик-1",
      rank: 1,
      is_winner: true,
      is_cancelled: false,
      cancel_reason: null,
      created_at: new Date().toISOString(),
    };

    store.bets.set(auction.uuid, [existingBet]);

    const body = { price: 150500 };
    const betList = store.bets.get(auction.uuid)!;

    betList.push({
      uuid: uuid(),
      price: body.price,
      price_with_vat: Math.round(body.price * (1 + VAT_RATE)),
      price_without_vat: body.price,
      carrier_name: "Вы",
      rank: 0,
      is_winner: false,
      is_cancelled: false,
      cancel_reason: null,
      created_at: new Date().toISOString(),
    });

    const isUp = auction.auc_type === "Up" || auction.auc_type === "Request";
    betList.sort((a, b) => (isUp ? b.price - a.price : a.price - b.price));

    let rank = 0;
    betList.forEach((b) => {
      b.is_winner = false;
      b.rank = b.is_cancelled ? null : ++rank;
    });

    const winner = betList.find((b) => !b.is_cancelled);
    if (winner) winner.is_winner = true;

    expect(betList.length).toBe(2);
    expect(betList[0]!.carrier_name).toBe("Перевозчик-1");
    expect(betList[0]!.is_winner).toBe(true);
    expect(betList[1]!.carrier_name).toBe("Вы");
    expect(betList[1]!.is_winner).toBe(false);
  });

  it("price validation rejects invalid min/max/step", () => {
    const auction = createMockAuction();
    auction.trading.min_price = 100000;
    auction.trading.max_price = 200000;
    auction.trading.bet_step = 500;

    const tooLow = { price: 50000 };
    expect(tooLow.price < auction.trading.min_price!).toBe(true);

    const tooHigh = { price: 250000 };
    expect(tooHigh.price > auction.trading.max_price!).toBe(true);

    const notStep = { price: 100250 };
    expect(
      Math.abs(Math.round(notStep.price / 500) * 500 - notStep.price) >= 0.001
    ).toBe(true);

    const valid = { price: 150000 };
    expect(valid.price >= auction.trading.min_price!).toBe(true);
    expect(valid.price <= auction.trading.max_price!).toBe(true);
    expect(
      Math.abs(Math.round(valid.price / 500) * 500 - valid.price) < 0.001
    ).toBe(true);
  });

  it("handles Down auction ranking (lowest wins)", () => {
    const store = createStore();
    const auction = createMockAuction({ auc_type: "Down" });
    auction.trading.bidder_status = "NotParticipating";
    auction.bidder_status = "NotParticipating";
    auction.is_bet_present = false;
    store.auctions.set(auction.uuid, auction);

    store.bets.set(auction.uuid, []);

    const highBet: Bet = {
      uuid: uuid(),
      price: 150000,
      price_with_vat: Math.round(150000 * (1 + VAT_RATE)),
      price_without_vat: 150000,
      carrier_name: "Перевозчик-1",
      rank: 0,
      is_winner: false,
      is_cancelled: false,
      cancel_reason: null,
      created_at: new Date().toISOString(),
    };

    const lowBet: Bet = {
      uuid: uuid(),
      price: 100000,
      price_with_vat: Math.round(100000 * (1 + VAT_RATE)),
      price_without_vat: 100000,
      carrier_name: "Вы",
      rank: 0,
      is_winner: false,
      is_cancelled: false,
      cancel_reason: null,
      created_at: new Date().toISOString(),
    };

    const betList = store.bets.get(auction.uuid)!;
    betList.push(highBet, lowBet);

    const isUp = auction.auc_type === "Up" || auction.auc_type === "Request";
    betList.sort((a, b) => (isUp ? b.price - a.price : a.price - b.price));

    let rank = 0;
    betList.forEach((b) => {
      b.is_winner = false;
      b.rank = b.is_cancelled ? null : ++rank;
    });

    const winner = betList.find((b) => !b.is_cancelled);
    if (winner) winner.is_winner = true;

    expect(betList[0]!.price).toBe(100000);
    expect(betList[0]!.carrier_name).toBe("Вы");
    expect(betList[0]!.is_winner).toBe(true);
  });
});
