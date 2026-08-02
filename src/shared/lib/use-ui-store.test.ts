import { describe, it, expect, beforeEach } from "vitest";
import { useUiStore } from "./use-ui-store";

describe("useUiStore", () => {
  beforeEach(() => {
    useUiStore.setState({ detailTab: "detail", betFormOpened: false });
  });

  describe("detailTab", () => {
    it("defaults to detail", () => {
      expect(useUiStore.getState().detailTab).toBe("detail");
    });

    it("switches to bets", () => {
      useUiStore.getState().setDetailTab("bets");
      expect(useUiStore.getState().detailTab).toBe("bets");
    });

    it("switches back to detail", () => {
      useUiStore.getState().setDetailTab("bets");
      useUiStore.getState().setDetailTab("detail");
      expect(useUiStore.getState().detailTab).toBe("detail");
    });
  });

  describe("betFormOpened", () => {
    it("defaults to false", () => {
      expect(useUiStore.getState().betFormOpened).toBe(false);
    });

    it("opens bet form", () => {
      useUiStore.getState().openBetForm();
      expect(useUiStore.getState().betFormOpened).toBe(true);
    });

    it("closes bet form", () => {
      useUiStore.getState().openBetForm();
      useUiStore.getState().closeBetForm();
      expect(useUiStore.getState().betFormOpened).toBe(false);
    });
  });

  describe("initFromUrl", () => {
    it("sets tab from URL param", () => {
      useUiStore.getState().initFromUrl("bets", false);
      expect(useUiStore.getState().detailTab).toBe("bets");
    });

    it("opens bet form when action=set-bet", () => {
      useUiStore.getState().initFromUrl("detail", true);
      expect(useUiStore.getState().betFormOpened).toBe(true);
    });

    it("keeps default when no params", () => {
      useUiStore.getState().initFromUrl(undefined, false);
      expect(useUiStore.getState().detailTab).toBe("detail");
      expect(useUiStore.getState().betFormOpened).toBe(false);
    });
  });
});
