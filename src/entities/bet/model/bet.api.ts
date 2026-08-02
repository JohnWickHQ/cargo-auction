import { apiClient } from "@/shared/api";
import type {
  BetsResponse,
  SetBetRequest,
  SetBetResponse,
} from "@/shared/types";

export function fetchBets(auctionUuid: string): Promise<BetsResponse> {
  return apiClient.get<BetsResponse>(`/auctions/${auctionUuid}/bets`);
}

export function postBet(
  auctionUuid: string,
  body: SetBetRequest
): Promise<SetBetResponse> {
  return apiClient.post<SetBetResponse>(`/auctions/${auctionUuid}/bets`, body);
}
