import { useSuspenseQuery } from "@tanstack/react-query";
import type { AuctionListRequest } from "@/shared/types";
import { fetchAuctionList, fetchAuctionDetail } from "./auction.api";

export function useAuctionList(params: AuctionListRequest) {
  return useSuspenseQuery({
    queryKey: ["auctions", params],
    queryFn: () => fetchAuctionList(params),
    retry: 1,
  });
}

export function useAuctionDetail(uuid: string) {
  return useSuspenseQuery({
    queryKey: ["auction", uuid],
    queryFn: () => fetchAuctionDetail(uuid),
    retry: 1,
  });
}
