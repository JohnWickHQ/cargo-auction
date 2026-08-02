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

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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

function generateTrading(aucType: AuctionType, currentPrice: number): Trading {
  const steps = [50, 100, 200, 500, 1000] as const;
  const step = steps[randomInt(0, 4)]!;
  const snap = (v: number) => Math.round(v / step) * step;

  const minRaw =
    aucType === "Down"
      ? Math.max(1000, currentPrice - randomInt(5000, 20000))
      : currentPrice - randomInt(0, 5000);

  return {
    can_set_bet: aucType !== "FixPrice" && Math.random() > 0.2,
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
    const status = AUCTION_STATUSES[i % AUCTION_STATUSES.length]!;
    const loadCity = pick(CITIES)!;
    let unloadCity = pick(CITIES)!;
    while (unloadCity === loadCity) {
      unloadCity = pick(CITIES)!;
    }

    const currentPrice = randomInt(10000, 200000);
    const hideAddresses = Math.random() > 0.8;
    const hideBetsHistory = Math.random() > 0.85;
    const noViewCargoPrice = Math.random() > 0.9;
    const trading = generateTrading(aucType, currentPrice);

    const bidderStatus: BidderStatus =
      BIDDER_STATUSES[i % BIDDER_STATUSES.length]!;

    const auction: AuctionDetail = {
      uuid: uuid(),
      cargo_num: `A24-${String(i + 1).padStart(4, "0")}`,
      auc_type: aucType,
      status,
      load_city: loadCity,
      unload_city: unloadCity,
      load_date:
        new Date(Date.now() + randomInt(1, 14) * 86400000)
          .toISOString()
          .split("T")[0] ?? "",
      unload_date:
        new Date(Date.now() + randomInt(15, 30) * 86400000)
          .toISOString()
          .split("T")[0] ?? "",
      cargo_name: pick(CARGO_NAMES)!,
      cargo_weight: Math.random() > 0.1 ? randomInt(500, 20000) : null,
      cargo_volume: Math.random() > 0.15 ? randomInt(10, 100) : null,
      body_type: Math.random() > 0.2 ? pick(BODY_TYPES)! : null,
      current_price: noViewCargoPrice ? 0 : currentPrice,
      price_per_km: Math.random() > 0.2 ? randomInt(5, 50) : null,
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
