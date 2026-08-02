import { describe, it, expect } from "vitest";
import { detailSearchSchema } from "./detail-search.schema";

describe("detailSearchSchema", () => {
  it("parses empty params with undefined values", () => {
    const result = detailSearchSchema.parse({});
    expect(result).toEqual({});
  });

  it("parses action=set-bet", () => {
    const result = detailSearchSchema.parse({ action: "set-bet" });
    expect(result.action).toBe("set-bet");
  });

  it("parses tab=detail", () => {
    const result = detailSearchSchema.parse({ tab: "detail" });
    expect(result.tab).toBe("detail");
  });

  it("parses tab=bets", () => {
    const result = detailSearchSchema.parse({ tab: "bets" });
    expect(result.tab).toBe("bets");
  });

  it("parses both params", () => {
    const result = detailSearchSchema.parse({
      tab: "bets",
      action: "set-bet",
    });
    expect(result.tab).toBe("bets");
    expect(result.action).toBe("set-bet");
  });

  it("discards invalid action via catch", () => {
    const result = detailSearchSchema.parse({ action: "invalid" });
    expect(result.action).toBeUndefined();
  });

  it("discards invalid tab via catch", () => {
    const result = detailSearchSchema.parse({ tab: "other" });
    expect(result.tab).toBeUndefined();
  });
});
