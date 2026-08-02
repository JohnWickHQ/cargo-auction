import type {
  AuctionType,
  AuctionStatus,
  BidderStatus,
  PrimaryAction,
  RoutePointType,
} from "./enums";

export interface Organizer {
  name: string;
  inn: string;
}

export interface Contact {
  phone: string;
  email: string;
  person: string;
}

export interface RoutePoint {
  city: string;
  address: string;
  type: RoutePointType;
  date: string;
}

export interface Trading {
  can_set_bet: boolean;
  current_price: number;
  min_price: number | null;
  max_price: number | null;
  bet_step: number;
  bidder_status: BidderStatus;
}

export interface AuctionListItem {
  uuid: string;
  cargo_num: string;
  auc_type: AuctionType;
  status: AuctionStatus;
  load_city: string;
  unload_city: string;
  load_date: string | null;
  unload_date: string | null;
  cargo_name: string;
  cargo_weight: number | null;
  cargo_volume: number | null;
  body_type: string | null;
  current_price: number;
  price_per_km: number | null;
  bet_step: number;
  bidder_status: BidderStatus;
  is_bet_present: boolean;
  primary_action: PrimaryAction;
}

export interface AuctionDetail extends AuctionListItem {
  organizer: Organizer;
  contacts: Contact | null;
  route_points: RoutePoint[];
  cargo_requirements: string | null;
  payment_terms: string | null;
  trading: Trading;
  hide_bets_history: boolean;
  hide_points_address_and_contacts: boolean;
  no_view_cargo_price: boolean;
}

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

export interface AuctionListRequest {
  cargo_num?: string;
  status?: string;
  statuses?: string[];
  auc_type?: string;
  load_city?: string;
  unload_city?: string;
  load_date_from?: string;
  load_date_to?: string;
  is_available?: boolean;
  is_bidder?: boolean;
  price_from?: number;
  price_to?: number;
  page: number;
  per_page: number;
}

export interface AuctionListResponse {
  items: AuctionListItem[];
  total: number;
  page: number;
  per_page: number;
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
