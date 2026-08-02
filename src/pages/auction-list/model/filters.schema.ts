import { z } from "zod";

export const auctionFiltersSchema = z.object({
  page: z.coerce.number().int().positive().default(1).catch(1),
  per_page: z.coerce.number().int().positive().max(100).default(20).catch(20),
  cargo_num: z.string().optional().catch(undefined),
  status: z.string().optional().catch(undefined),
  statuses: z.array(z.string()).optional().catch(undefined),
  auc_type: z.string().optional().catch(undefined),
  load_city: z.string().optional().catch(undefined),
  unload_city: z.string().optional().catch(undefined),
  load_date_from: z.string().optional().catch(undefined),
  load_date_to: z.string().optional().catch(undefined),
  is_available: z.enum(["true", "false"]).optional().catch(undefined),
  is_bidder: z.enum(["true", "false"]).optional().catch(undefined),
  price_from: z.coerce.number().optional().catch(undefined),
  price_to: z.coerce.number().optional().catch(undefined),
});

export type AuctionFilters = z.infer<typeof auctionFiltersSchema>;
