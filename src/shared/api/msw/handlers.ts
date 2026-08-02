import { http, HttpResponse } from "msw";
import type {
  AuctionListRequest,
  SetBetRequest,
  SetBetResponse,
  BetsResponse,
  Bet,
} from "@/shared/types";
import { API_BASE_URL, VAT_RATE } from "@/shared/config";
import type { MswStore } from "./store";
import { createStore } from "./store";
import { generateSeedAuctions } from "./seed";
import { filterAuctions } from "./filter-auctions";
import {
  uuid,
  createBet,
  rankBets,
  validateBetPrice,
  applyWinStatus,
} from "./bet-logic";

let _store: MswStore | null = null;

function getStore(): MswStore {
  if (!_store) {
    _store = createStore();
  }
  return _store;
}

function initStore() {
  const store = getStore();
  const auctions = generateSeedAuctions(75);
  for (const auction of auctions) {
    store.auctions.set(auction.uuid, auction);
    const hasBets =
      auction.bidder_status !== "NotParticipating" && auction.current_price > 0;
    const betCount = hasBets ? Math.floor(Math.random() * 5) + 1 : 0;
    const bets: Bet[] = [];

    for (let i = 0; i < betCount; i++) {
      const betPrice =
        auction.auc_type === "FixPrice"
          ? auction.current_price
          : auction.auc_type === "Down"
            ? auction.current_price + (betCount - i) * auction.bet_step * 2
            : auction.current_price - (betCount - i) * auction.bet_step * 2;
      const isCancelled = Math.random() > 0.85;
      bets.push({
        uuid: uuid(),
        price: betPrice,
        price_with_vat: Math.round(betPrice * (1 + VAT_RATE)),
        price_without_vat: betPrice,
        carrier_name: `Перевозчик-${i + 1}`,
        rank: 0,
        is_winner: false,
        is_cancelled: isCancelled,
        cancel_reason: isCancelled ? "Дубликат ставки" : null,
        created_at: new Date(
          Date.now() - (betCount - i) * 3600000
        ).toISOString(),
      });
    }

    const ranked = rankBets(bets, auction.auc_type);

    const winner = ranked.find((b) => !b.is_cancelled);
    if (winner) {
      winner.is_winner = true;
      auction.current_price = winner.price;
      auction.trading.current_price = winner.price;
    }

    store.bets.set(auction.uuid, ranked);

    if (auction.auc_type === "FixPrice" && ranked.length > 0) {
      auction.trading.can_set_bet = false;
      auction.primary_action = "disabled";
    }
  }
}

void initStore();

export const handlers = [
  http.post(`${API_BASE_URL}/auctions/list`, async ({ request }) => {
    const body = (await request.json()) as AuctionListRequest;
    const response = filterAuctions(getStore().auctions, body);
    return HttpResponse.json(response);
  }),

  http.get(`${API_BASE_URL}/auctions/:auctionUuid`, ({ params }) => {
    const { auctionUuid } = params;
    const auction = getStore().auctions.get(auctionUuid as string);
    if (!auction) {
      return HttpResponse.json(
        { error: "NOT_FOUND", message: "Аукцион не найден" },
        { status: 404 }
      );
    }
    return HttpResponse.json(auction);
  }),

  http.get(`${API_BASE_URL}/auctions/:auctionUuid/bets`, ({ params }) => {
    const { auctionUuid } = params;
    const auction = getStore().auctions.get(auctionUuid as string);
    if (!auction) {
      return HttpResponse.json(
        { error: "NOT_FOUND", message: "Аукцион не найден" },
        { status: 404 }
      );
    }
    const betList = getStore().bets.get(auctionUuid as string) ?? [];
    const response: BetsResponse = {
      items: betList,
      total_participants: new Set(betList.map((b) => b.carrier_name)).size,
    };
    return HttpResponse.json(response);
  }),

  http.post(
    `${API_BASE_URL}/auctions/:auctionUuid/bets`,
    async ({ params, request }) => {
      const auctionUuid = params.auctionUuid as string;
      const auction = getStore().auctions.get(auctionUuid as string);
      if (!auction) {
        return HttpResponse.json(
          { error: "NOT_FOUND", message: "Аукцион не найден" },
          { status: 404 }
        );
      }

      const body = (await request.json()) as SetBetRequest;
      const { trading } = auction;

      const validationError = validateBetPrice(body.price, {
        minPrice: trading.min_price,
        maxPrice: trading.max_price,
        betStep: trading.bet_step,
      });
      if (validationError) {
        return HttpResponse.json(
          {
            error: "VALIDATION_ERROR",
            message: validationError,
            details: [{ field: "price", message: validationError }],
          },
          { status: 422 }
        );
      }

      const betList = getStore().bets.get(auctionUuid as string) ?? [];

      const newBet = createBet(body.price, "Вы");
      betList.push(newBet);

      const ranked = rankBets(betList, auction.auc_type);
      applyWinStatus(ranked, auction);

      getStore().bets.set(auctionUuid as string, ranked);

      const response: SetBetResponse = {
        success: true,
        new_current_price: body.price,
        bidder_status: auction.bidder_status,
      };

      return HttpResponse.json(response, { status: 201 });
    }
  ),
];
