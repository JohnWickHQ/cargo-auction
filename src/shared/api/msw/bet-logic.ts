import type { Bet, BidderStatus, AuctionDetail } from "@/shared/types";
import { VAT_RATE } from "@/shared/config";

export function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createBet(price: number, carrierName = "Перевозчик-1"): Bet {
  return {
    uuid: uuid(),
    price,
    price_with_vat: Math.round(price * (1 + VAT_RATE)),
    price_without_vat: price,
    carrier_name: carrierName,
    rank: 0,
    is_winner: false,
    is_cancelled: false,
    cancel_reason: null,
    created_at: new Date().toISOString(),
  };
}

export function rankBets(bets: Bet[], aucType: string): Bet[] {
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

export function validateBetPrice(
  price: number,
  {
    minPrice,
    maxPrice,
    betStep,
  }: { minPrice?: number | null; maxPrice?: number | null; betStep: number }
): string | null {
  if (!price || price <= 0) {
    return "Цена обязательна и должна быть больше 0";
  }
  if (minPrice && price < minPrice) {
    return `Минимальная цена: ${minPrice}`;
  }
  if (maxPrice && price > maxPrice) {
    return `Максимальная цена: ${maxPrice}`;
  }
  const deviation = Math.abs(Math.round(price / betStep) * betStep - price);
  if (deviation >= 0.001) {
    return `Шаг ставки: ${betStep}`;
  }
  return null;
}

export function applyWinStatus(ranked: Bet[], auction: AuctionDetail): void {
  const winner = ranked.find((b) => !b.is_cancelled);
  if (winner) {
    auction.current_price = winner.price;
    auction.trading.current_price = winner.price;
  }

  const userIsWinner = winner?.carrier_name === "Вы";
  const newStatus: BidderStatus = userIsWinner ? "Leading" : "Outbid";
  auction.bidder_status = newStatus;
  auction.trading.bidder_status = newStatus;
  auction.is_bet_present = true;
  auction.primary_action = "change_bet";

  if (auction.auc_type === "FixPrice") {
    auction.trading.can_set_bet = false;
    auction.primary_action = "disabled";
  }
}
