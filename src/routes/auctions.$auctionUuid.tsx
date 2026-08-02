import { createRoute } from "@tanstack/react-router";
import { AuctionDetailPage } from "@/pages/auction-detail";
import { z } from "zod";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auctions/$auctionUuid",
  component: AuctionDetailPage,
  validateSearch: z.object({
    action: z.enum(["set-bet"]).optional().catch(undefined),
    tab: z.enum(["detail", "bets"]).optional().catch(undefined),
  }),
});
