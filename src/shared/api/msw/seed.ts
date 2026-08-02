import type {
  AuctionDetail,
  AuctionType,
  AuctionStatus,
  BidderStatus,
  PrimaryAction,
  Organizer,
  Contact,
  RoutePoint,
  Trading,
} from "@/shared/types";
import { CITIES } from "@/shared/config";
import { uuid } from "@/shared/lib";

const BET_STEP_OPTIONS = [50, 100, 200, 500, 1000] as const;

const MIN_DOWN_PRICE = 1000;
const PRICE_RANGE_MIN = 10_000;
const PRICE_RANGE_MAX = 200_000;
const PRICE_SPREAD_MIN = 0;
const PRICE_SPREAD_MAX = 5000;
const DOWN_PRICE_SPREAD_MAX = 20_000;
const DOWN_PRICE_SPREAD_MIN = 5000;

const DATE_LOAD_MIN = 1;
const DATE_LOAD_MAX = 14;
const DATE_UNLOAD_MIN = 15;
const DATE_UNLOAD_MAX = 30;

const CARGO_WEIGHT_MIN = 500;
const CARGO_WEIGHT_MAX = 20_000;
const CARGO_VOLUME_MIN = 10;
const CARGO_VOLUME_MAX = 100;
const PRICE_PER_KM_MIN = 5;
const PRICE_PER_KM_MAX = 50;

function pick<T>(arr: readonly T[]): T {
  const value = arr[Math.floor(Math.random() * arr.length)];
  if (value === undefined) throw new Error("Cannot pick from empty array");
  return value;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const CARGO_NAMES = [
  "Строительные материалы",
  "Продукты питания",
  "Бытовая техника",
  "Мебель",
  "Металлопрокат",
  "Автозапчасти",
  "Текстиль",
  "Химическая продукция",
  "Древесина",
  "Электроника",
];

const BODY_TYPES = ["Тент", "Рефрижератор", "Изотерм", "Борт", "Цельнометалл"];

const AUCTION_TYPES: AuctionType[] = ["Request", "Up", "Down", "FixPrice"];
const AUCTION_STATUSES: AuctionStatus[] = [
  "Active",
  "Completed",
  "Cancelled",
  "Draft",
];
const BIDDER_STATUSES: BidderStatus[] = [
  "Leading",
  "Losing",
  "Winner",
  "NotParticipating",
  "Outbid",
];

function generateOrganizer(): Organizer {
  return {
    name: `ООО "Грузоотправитель-${randomInt(1, 99)}"`,
    inn: `${randomInt(1000000000, 9999999999)}`,
  };
}

function generateContacts(): Contact | null {
  if (Math.random() > 0.3) {
    return {
      phone: `+7 (9${randomInt(10, 99)}) ${randomInt(100, 999)}-${randomInt(10, 99)}-${randomInt(10, 99)}`,
      email: `contact-${randomInt(1, 99)}@logistics.ru`,
      person: `${pick(["Иванов"!, "Петров", "Сидоров", "Кузнецов", "Смирнов", "Попов"])} ${pick(["А.А."!, "И.В.", "С.М.", "Д.К.", "М.Н."])}`,
    };
  }
  return null;
}

function generateRoutePoints(
  loadCity: string,
  unloadCity: string,
  hideAddresses: boolean
): RoutePoint[] {
  return [
    {
      city: loadCity,
      address: hideAddresses
        ? ""
        : `г. ${loadCity}, ул. ${pick(["Ленина", "Мира", "Пушкина", "Гагарина", "Советская"])!}, ${randomInt(1, 200)}`,
      type: "loading",
      date:
        new Date(Date.now() + randomInt(1, 14) * 86400000)
          .toISOString()
          .split("T")[0] ?? "",
    },
    {
      city: unloadCity,
      address: hideAddresses
        ? ""
        : `г. ${unloadCity}, ул. ${pick(["Ленина", "Мира", "Пушкина", "Гагарина", "Советская"])!}, ${randomInt(1, 200)}`,
      type: "unloading",
      date:
        new Date(Date.now() + randomInt(15, 30) * 86400000)
          .toISOString()
          .split("T")[0] ?? "",
    },
  ];
}

function generateTrading(
  aucType: AuctionType,
  status: AuctionStatus,
  currentPrice: number
): Trading {
  const steps = BET_STEP_OPTIONS as unknown as number[];
  const step = pick(steps);
  const snap = (v: number) => Math.round(v / step) * step;

  const minRaw =
    aucType === "Down"
      ? Math.max(
          MIN_DOWN_PRICE,
          currentPrice - randomInt(DOWN_PRICE_SPREAD_MIN, DOWN_PRICE_SPREAD_MAX)
        )
      : currentPrice - randomInt(PRICE_SPREAD_MIN, PRICE_SPREAD_MAX);

  return {
    can_set_bet:
      status !== "Cancelled" && status !== "Draft" && Math.random() > 0.2,
    current_price: snap(currentPrice),
    min_price: snap(minRaw),
    max_price:
      aucType === "Up" ? snap(currentPrice + randomInt(5000, 20000)) : null,
    bet_step: step,
    bidder_status: pick(BIDDER_STATUSES)!,
  };
}

function determinePrimaryAction(
  bidderStatus: BidderStatus,
  canSetBet: boolean
): PrimaryAction {
  if (!canSetBet) return "disabled";
  if (bidderStatus === "NotParticipating") return "make_bet";
  if (bidderStatus === "Leading") return "change_bet";
  return "view_bets";
}

export function generateSeedAuctions(count: number): AuctionDetail[] {
  const auctions: AuctionDetail[] = [];

  for (let i = 0; i < count; i++) {
    const aucType = AUCTION_TYPES[i % AUCTION_TYPES.length]!;
    const status = pick(AUCTION_STATUSES)!;
    const loadCity = pick(CITIES)!;
    let unloadCity = pick(CITIES)!;
    while (unloadCity === loadCity) {
      unloadCity = pick(CITIES)!;
    }

    const currentPrice = randomInt(PRICE_RANGE_MIN, PRICE_RANGE_MAX);
    const hideAddresses = Math.random() > 0.8;
    const hideBetsHistory = Math.random() > 0.85;
    const noViewCargoPrice = Math.random() > 0.9;
    const trading = generateTrading(aucType, status, currentPrice);

    const bidderStatus: BidderStatus = pick(BIDDER_STATUSES);

    const auction: AuctionDetail = {
      uuid: uuid(),
      cargo_num: `A24-${String(i + 1).padStart(4, "0")}`,
      auc_type: aucType,
      status,
      load_city: loadCity,
      unload_city: unloadCity,
      load_date: new Date(
        Date.now() + randomInt(DATE_LOAD_MIN, DATE_LOAD_MAX) * 86400000
      )
        .toISOString()
        .split("T")[0]!,
      unload_date: new Date(
        Date.now() + randomInt(DATE_UNLOAD_MIN, DATE_UNLOAD_MAX) * 86400000
      )
        .toISOString()
        .split("T")[0]!,
      cargo_name: pick(CARGO_NAMES),
      cargo_weight:
        Math.random() > 0.1
          ? randomInt(CARGO_WEIGHT_MIN, CARGO_WEIGHT_MAX)
          : null,
      cargo_volume:
        Math.random() > 0.15
          ? randomInt(CARGO_VOLUME_MIN, CARGO_VOLUME_MAX)
          : null,
      body_type: Math.random() > 0.2 ? pick(BODY_TYPES) : null,
      current_price: noViewCargoPrice ? 0 : currentPrice,
      price_per_km:
        Math.random() > 0.2
          ? randomInt(PRICE_PER_KM_MIN, PRICE_PER_KM_MAX)
          : null,
      bet_step: trading.bet_step,
      bidder_status: bidderStatus,
      is_bet_present: bidderStatus !== "NotParticipating",
      primary_action: determinePrimaryAction(bidderStatus, trading.can_set_bet),
      organizer: generateOrganizer(),
      contacts: generateContacts(),
      route_points: generateRoutePoints(loadCity, unloadCity, hideAddresses),
      cargo_requirements:
        Math.random() > 0.3
          ? "Температурный режим -18C, гидроборт обязателен"
          : null,
      payment_terms:
        Math.random() > 0.2 ? "Безналичный расчет, отсрочка 14 дней" : null,
      trading,
      hide_bets_history: hideBetsHistory,
      hide_points_address_and_contacts: hideAddresses,
      no_view_cargo_price: noViewCargoPrice,
    };

    auctions.push(auction);
  }

  return auctions;
}
