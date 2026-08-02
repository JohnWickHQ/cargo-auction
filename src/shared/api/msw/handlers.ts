/* eslint-disable max-lines */ import { http, HttpResponse } from "msw";
import type {
  AuctionListResponse,
  AuctionListRequest,
  SetBetRequest,
  SetBetResponse,
  BetsResponse,
  Bet,
  BidderStatus,
} from "@/shared/types";
import { API_BASE_URL, VAT_RATE } from "@/shared/config";
import type { MswStore } from "./store";
import { createStore } from "./store";
import { generateSeedAuctions } from "./seed";

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const store: MswStore = createStore();

function initStore() {
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

    const isUp = auction.auc_type === "Up" || auction.auc_type === "Request";
    bets.sort((a, b) => (isUp ? b.price - a.price : a.price - b.price));

    let rank = 0;
    bets.forEach((b) => {
      b.rank = b.is_cancelled ? null : ++rank;
    });

    const winner = bets.find((b) => !b.is_cancelled);
    if (winner) {
      winner.is_winner = true;
      auction.current_price = winner.price;
      auction.trading.current_price = winner.price;
    }

    store.bets.set(auction.uuid, bets);

    if (auction.auc_type === "FixPrice" && bets.length > 0) {
      auction.trading.can_set_bet = false;
      auction.primary_action = "disabled";
    }
  }
}

void initStore();

// eslint-disable-next-line complexity
function filterAuctions(request: AuctionListRequest): AuctionListResponse {
  let items = Array.from(store.auctions.values());

  if (request.cargo_num) {
    const num = request.cargo_num.toLowerCase();
    items = items.filter((a) => a.cargo_num.toLowerCase().includes(num));
  }
  if (request.status) {
    items = items.filter((a) => a.status === request.status);
  }
  if (request.statuses && request.statuses.length > 0) {
    items = items.filter((a) => request.statuses!.includes(a.status));
  }
  if (request.auc_type) {
    items = items.filter((a) => a.auc_type === request.auc_type);
  }
  if (request.load_city) {
    items = items.filter((a) => a.load_city === request.load_city);
  }
  if (request.unload_city) {
    items = items.filter((a) => a.unload_city === request.unload_city);
  }
  if (request.load_date_from) {
    items = items.filter(
      (a) => a.load_date && a.load_date >= request.load_date_from!
    );
  }
  if (request.load_date_to) {
    items = items.filter(
      (a) => a.load_date && a.load_date <= request.load_date_to!
    );
  }
  if (request.is_available !== undefined) {
    items = items.filter(
      (a) => (a.status === "Active") === request.is_available
    );
  }
  if (request.is_bidder !== undefined) {
    items = items.filter((a) => a.is_bet_present === request.is_bidder);
  }
  if (request.price_from !== undefined) {
    items = items.filter((a) => a.current_price >= request.price_from!);
  }
  if (request.price_to !== undefined) {
    items = items.filter((a) => a.current_price <= request.price_to!);
  }

  const total = items.length;
  const page = request.page ?? 1;
  const perPage = request.per_page ?? 20;
  const start = (page - 1) * perPage;
  const paginated = items.slice(start, start + perPage);

  return {
    items: paginated.map((a) => ({
      uuid: a.uuid,
      cargo_num: a.cargo_num,
      auc_type: a.auc_type,
      status: a.status,
      load_city: a.load_city,
      unload_city: a.unload_city,
      load_date: a.load_date,
      unload_date: a.unload_date,
      cargo_name: a.cargo_name,
      cargo_weight: a.cargo_weight,
      cargo_volume: a.cargo_volume,
      body_type: a.body_type,
      current_price: a.current_price,
      price_per_km: a.price_per_km,
      bet_step: a.bet_step,
      bidder_status: a.bidder_status,
      is_bet_present: a.is_bet_present,
      primary_action: a.primary_action,
    })),
    total,
    page,
    per_page: perPage,
  };
}

export const handlers = [
  http.post(`${API_BASE_URL}/auctions/list`, async ({ request }) => {
    const body = (await request.json()) as AuctionListRequest;
    const response = filterAuctions(body);
    return HttpResponse.json(response);
  }),

  http.get(`${API_BASE_URL}/auctions/:auctionUuid`, ({ params }) => {
    const { auctionUuid } = params;
    const auction = store.auctions.get(auctionUuid as string);
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
    const auction = store.auctions.get(auctionUuid as string);
    if (!auction) {
      return HttpResponse.json(
        { error: "NOT_FOUND", message: "Аукцион не найден" },
        { status: 404 }
      );
    }
    const betList = store.bets.get(auctionUuid as string) ?? [];
    const response: BetsResponse = {
      items: betList,
      total_participants: new Set(betList.map((b) => b.carrier_name)).size,
    };
    return HttpResponse.json(response);
  }),

  /* eslint-disable complexity */
  http.post(
    `${API_BASE_URL}/auctions/:auctionUuid/bets`,
    async ({ params, request }) => {
      const auctionUuid = params.auctionUuid as string;
      const auction = store.auctions.get(auctionUuid as string);
      if (!auction) {
        return HttpResponse.json(
          { error: "NOT_FOUND", message: "Аукцион не найден" },
          { status: 404 }
        );
      }

      const body = (await request.json()) as SetBetRequest;

      if (!body.price || body.price <= 0) {
        return HttpResponse.json(
          {
            error: "VALIDATION_ERROR",
            message: "Цена обязательна и должна быть больше 0",
            details: [
              {
                field: "price",
                message: "Цена обязательна и должна быть больше 0",
              },
            ],
          },
          { status: 422 }
        );
      }

      const { trading } = auction;
      if (trading.min_price && body.price < trading.min_price) {
        return HttpResponse.json(
          {
            error: "VALIDATION_ERROR",
            message: `Цена не может быть меньше ${trading.min_price}`,
            details: [
              {
                field: "price",
                message: `Минимальная цена: ${trading.min_price}`,
              },
            ],
          },
          { status: 422 }
        );
      }
      if (trading.max_price && body.price > trading.max_price) {
        return HttpResponse.json(
          {
            error: "VALIDATION_ERROR",
            message: `Цена не может быть больше ${trading.max_price}`,
            details: [
              {
                field: "price",
                message: `Максимальная цена: ${trading.max_price}`,
              },
            ],
          },
          { status: 422 }
        );
      }
      const deviation = Math.abs(
        Math.round(body.price / trading.bet_step) * trading.bet_step -
          body.price
      );
      if (deviation >= 0.001) {
        return HttpResponse.json(
          {
            error: "VALIDATION_ERROR",
            message: `Цена должна быть кратна шагу ставки (${trading.bet_step})`,
            details: [
              { field: "price", message: `Шаг ставки: ${trading.bet_step}` },
            ],
          },
          { status: 422 }
        );
      }

      const betList = store.bets.get(auctionUuid as string) ?? [];

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

      const winningBet = betList.find((b) => !b.is_cancelled);
      if (winningBet) {
        winningBet.is_winner = true;
        auction.current_price = winningBet.price;
        auction.trading.current_price = winningBet.price;
      }

      store.bets.set(auctionUuid as string, betList);

      const userIsWinner = winningBet?.carrier_name === "Вы";
      const newStatus: BidderStatus = userIsWinner ? "Leading" : "Outbid";
      auction.bidder_status = newStatus;
      auction.trading.bidder_status = newStatus;
      auction.is_bet_present = true;
      auction.primary_action = "change_bet";

      if (auction.auc_type === "FixPrice") {
        auction.trading.can_set_bet = false;
        auction.primary_action = "disabled";
      }

      const response: SetBetResponse = {
        success: true,
        new_current_price: body.price,
        bidder_status: newStatus,
      };

      return HttpResponse.json(response, { status: 201 });
    }
    /* eslint-enable complexity */
  ),
];
