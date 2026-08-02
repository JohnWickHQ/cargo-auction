import type { PrimaryAction } from "@/shared/types";

export function getBetAction(primaryAction: PrimaryAction) {
  switch (primaryAction) {
    case "view_bets":
      return { search: { tab: "bets" as const } };
    case "make_bet":
    case "change_bet":
      return { search: { action: "set-bet" as const } };
    case "disabled":
      return null;
  }
}
