export { useBets, useSetBet } from "./model/bet.hooks";
export { fetchBets, postBet } from "./model/bet.api";
export type {
  Bet,
  BetsResponse,
  SetBetRequest,
  SetBetResponse,
  ValidationError,
} from "@/shared/types";
