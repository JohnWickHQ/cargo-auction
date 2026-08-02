import type {
  Bet,
  BidderStatus,
  AuctionDetail,
  AuctionType,
} from "@/shared/types";
import { VAT_RATE } from "@/shared/config";
import { uuid } from "@/shared/lib";

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

function cloneBet(b: Bet): Bet {
  return { ...b };
}

export function rankBets(bets: Bet[], aucType: AuctionType): Bet[] {
  const isUp = aucType === "Up" || aucType === "Request";
  const sorted = [...bets]
    .map(cloneBet)
    .sort((a, b) => (isUp ? b.price - a.price : a.price - b.price));

  let rank = 0;
  for (const b of sorted) {
    b.is_winner = false;
    b.rank = b.is_cancelled ? null : ++rank;
  }

  const winner = sorted.find((b) => !b.is_cancelled);
  if (winner) winner.is_winner = true;

  return sorted;
}

export { validateBetPrice } from "@/shared/lib/bet-validation";

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
