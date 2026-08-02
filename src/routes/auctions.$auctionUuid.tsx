import { createRoute } from "@tanstack/react-router";
import { AuctionDetailPage } from "@/pages/auction-detail";
import { detailSearchSchema } from "@/pages/auction-detail";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auctions/$auctionUuid",
  component: AuctionDetailPage,
  validateSearch: detailSearchSchema,
});
