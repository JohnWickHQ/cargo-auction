export const actionLabels: Record<string, string> = {
  make_bet: "Сделать ставку",
  change_bet: "Изменить ставку",
  view_bets: "Смотреть ставки",
  disabled: "Недоступно",
};

export const auctionTypeLabels: Record<string, string> = {
  Request: "Заявка",
  Up: "Повышение",
  Down: "Понижение",
  FixPrice: "Фикс. цена",
};

export const auctionTypeColors: Record<string, string> = {
  Request: "blue",
  Up: "green",
  Down: "red",
  FixPrice: "gray",
};

export const auctionStatusLabels: Record<string, string> = {
  Active: "Активен",
  Completed: "Завершён",
  Cancelled: "Отменён",
  Draft: "Черновик",
};

export const statusColors: Record<string, string> = {
  Active: "green",
  Completed: "blue",
  Cancelled: "red",
  Draft: "gray",
};

export const bidderStatusLabels: Record<string, string> = {
  Leading: "Лидируете",
  Losing: "Проигрываете",
  Winner: "Победитель",
  NotParticipating: "Не участвуете",
  Outbid: "Перебита ставка",
};

const priceCache = new Map<number, string>();
const MAX_CACHE_SIZE = 1000;

export function formatPrice(price: number): string {
  const cached = priceCache.get(price);
  if (cached !== undefined) return cached;

  if (priceCache.size >= MAX_CACHE_SIZE) {
    priceCache.clear();
  }

  const formatted = new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  priceCache.set(price, formatted);
  return formatted;
}
