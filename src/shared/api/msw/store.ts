import type { AuctionDetail, Bet } from "@/shared/types";

export interface MswStore {
  auctions: Map<string, AuctionDetail>;
  bets: Map<string, Bet[]>;
}

export function createStore(): MswStore {
  return {
    auctions: new Map(),
    bets: new Map(),
  };
}
