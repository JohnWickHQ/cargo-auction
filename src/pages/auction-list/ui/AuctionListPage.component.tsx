import { AuctionFilters } from "@/widgets/auction-filters";
import { AuctionTable } from "@/widgets/auction-table";

export function AuctionListPage() {
  return (
    <>
      <AuctionFilters />
      <AuctionTable />
    </>
  );
}
