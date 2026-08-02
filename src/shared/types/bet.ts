import type { BidderStatus } from "./auction";

export interface Bet {
  uuid: string;
  price: number;
  price_with_vat: number;
  price_without_vat: number;
  carrier_name: string;
  rank: number | null;
  is_winner: boolean;
  is_cancelled: boolean;
  cancel_reason: string | null;
  created_at: string;
}

export interface BetsResponse {
  items: Bet[];
  total_participants: number;
}

export interface SetBetRequest {
  price: number;
}

export interface SetBetResponse {
  success: boolean;
  new_current_price: number;
  bidder_status: BidderStatus;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ValidationError {
  error: "VALIDATION_ERROR";
  message: string;
  details: ValidationErrorDetail[];
}
