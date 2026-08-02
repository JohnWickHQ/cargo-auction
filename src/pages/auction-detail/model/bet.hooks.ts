import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { SetBetRequest } from "@/shared/types";
import { ApiError } from "@/shared/api";
import { isValidationError } from "@/shared/lib";
import { fetchBets, postBet } from "./bet.api";

export function useBets(auctionUuid: string) {
  return useSuspenseQuery({
    queryKey: ["bets", auctionUuid],
    queryFn: () => fetchBets(auctionUuid),
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
        if (isValidationError(error.body)) {
          throw error.body;
        }
      }
    },
    retry: 0,
  });
}
