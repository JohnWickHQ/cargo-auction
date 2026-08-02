import { AuctionFilters } from "./AuctionFilters.component";
import { AuctionTable } from "./AuctionTable.component";

export function AuctionListPage() {
  return (
    <>
      <AuctionFilters />
      <AuctionTable />
    </>
  );
}
