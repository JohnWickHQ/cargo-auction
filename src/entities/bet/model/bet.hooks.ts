import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SetBetRequest, ValidationError } from "@/shared/types";
import { ApiError } from "@/shared/api";
import { fetchBets, postBet } from "./bet.api";

export function useBets(auctionUuid: string) {
  return useQuery({
    queryKey: ["bets", auctionUuid],
    queryFn: () => fetchBets(auctionUuid),
    enabled: !!auctionUuid,
    retry: 1,
  });
}

export function useSetBet(auctionUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SetBetRequest) => postBet(auctionUuid, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["auctions"] });
      void queryClient.invalidateQueries({
        queryKey: ["auction", auctionUuid],
      });
      void queryClient.invalidateQueries({ queryKey: ["bets", auctionUuid] });
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && error.status === 422) {
        const validationError = error.body as ValidationError;
        throw validationError;
      }
    },
    retry: 0,
  });
}
