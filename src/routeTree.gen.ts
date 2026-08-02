import { Route as rootRoute } from "./routes/__root";
import { Route as indexRoute } from "./routes/index";
import { Route as auctionsIndexRoute } from "./routes/auctions.index";
import { Route as auctionsAuctionUuidRoute } from "./routes/auctions.$auctionUuid";

export const routeTree = rootRoute.addChildren([
  indexRoute,
  auctionsIndexRoute,
  auctionsAuctionUuidRoute,
]);
