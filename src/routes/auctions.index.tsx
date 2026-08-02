import { createRoute } from "@tanstack/react-router";
import { AuctionListPage } from "@/pages/auction-list";
import { auctionFiltersSchema } from "@/features/filter-auctions";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auctions/",
  component: AuctionListPage,
  validateSearch: auctionFiltersSchema,
});
