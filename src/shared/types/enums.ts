export const AuctionTypeValues = ["Request", "Up", "Down", "FixPrice"] as const;
export type AuctionType = (typeof AuctionTypeValues)[number];

export const AuctionStatusValues = [
  "Active",
  "Completed",
  "Cancelled",
  "Draft",
] as const;
export type AuctionStatus = (typeof AuctionStatusValues)[number];

export type BidderStatus =
  "Leading" | "Losing" | "Winner" | "NotParticipating" | "Outbid";

export type PrimaryAction =
  "make_bet" | "change_bet" | "view_bets" | "disabled";

export type RoutePointType = "loading" | "unloading";
