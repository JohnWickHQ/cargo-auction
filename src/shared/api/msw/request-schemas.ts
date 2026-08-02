import { z } from "zod";

export const setBetRequestSchema = z.object({
  price: z.number(),
});

export const auctionListRequestSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(100).optional(),
  cargo_num: z.string().optional(),
  status: z.string().optional(),
  statuses: z.array(z.string()).optional(),
  auc_type: z.string().optional(),
  load_city: z.string().optional(),
  unload_city: z.string().optional(),
  load_date_from: z.string().optional(),
  load_date_to: z.string().optional(),
  is_available: z.boolean().optional(),
  is_bidder: z.boolean().optional(),
  price_from: z.number().optional(),
  price_to: z.number().optional(),
});
