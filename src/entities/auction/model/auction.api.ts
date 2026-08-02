import { apiClient } from "@/shared/api";
import type {
  AuctionListRequest,
  AuctionListResponse,
  AuctionDetail,
} from "@/shared/types";

export function fetchAuctionList(
  params: AuctionListRequest
): Promise<AuctionListResponse> {
  return apiClient.post<AuctionListResponse>("/auctions/list", params);
}

export function fetchAuctionDetail(uuid: string): Promise<AuctionDetail> {
  return apiClient.get<AuctionDetail>(`/auctions/${uuid}`);
}
