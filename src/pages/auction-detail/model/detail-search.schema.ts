import { z } from "zod";

export const detailSearchSchema = z.object({
  action: z.enum(["set-bet"]).optional().catch(undefined),
  tab: z.enum(["detail", "bets"]).optional().catch(undefined),
});
