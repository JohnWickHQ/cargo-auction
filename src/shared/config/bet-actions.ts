export function getBetAction(primaryAction: string) {
  if (primaryAction === "view_bets")
    return { search: { tab: "bets" as const } };
  if (primaryAction === "make_bet" || primaryAction === "change_bet")
    return { search: { action: "set-bet" as const } };
  return null;
}
