import { create } from "zustand";

interface UiState {
  detailTab: "detail" | "bets";
  betFormOpened: boolean;
  setDetailTab: (tab: "detail" | "bets") => void;
  openBetForm: () => void;
  closeBetForm: () => void;
  initFromUrl: (tab?: "detail" | "bets", openBet?: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  detailTab: "detail",
  betFormOpened: false,
  setDetailTab: (tab) => set({ detailTab: tab }),
  openBetForm: () => set({ betFormOpened: true }),
  closeBetForm: () => set({ betFormOpened: false }),
  initFromUrl: (tab, openBet) =>
    set({
      detailTab: tab ?? "detail",
      betFormOpened: openBet ?? false,
    }),
}));
