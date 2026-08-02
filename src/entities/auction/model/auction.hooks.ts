import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { AuctionListRequest } from "@/shared/types";
import { fetchAuctionList, fetchAuctionDetail } from "./auction.api";

export function useAuctionList(params: AuctionListRequest) {
  return useQuery({
    queryKey: ["auctions", params],
    queryFn: () => fetchAuctionList(params),
    placeholderData: keepPreviousData,
    retry: 1,
  });
}

export function useAuctionDetail(uuid: string) {
  return useQuery({
    queryKey: ["auction", uuid],
    queryFn: () => fetchAuctionDetail(uuid),
    enabled: !!uuid,
    retry: 1,
  });
}
