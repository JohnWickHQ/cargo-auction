import { useQueryClient } from "@tanstack/react-query";
import { Card, Badge, Text, Group, Button, Stack } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { fetchAuctionDetail } from "@/entities/auction";
import type { AuctionListItem } from "@/shared/types";

const actionLabels: Record<string, string> = {
  make_bet: "Сделать ставку",
  change_bet: "Изменить ставку",
  view_bets: "Смотреть ставки",
  disabled: "Недоступно",
};
const auctionTypeLabels: Record<string, string> = {
  Request: "Заявка",
  Up: "Повышение",
  Down: "Понижение",
  FixPrice: "Фикс. цена",
};
const auctionStatusLabels: Record<string, string> = {
  Active: "Активен",
  Completed: "Завершён",
  Cancelled: "Отменён",
  Draft: "Черновик",
};
const auctionTypeColors: Record<string, string> = {
  Request: "blue",
  Up: "green",
  Down: "red",
  FixPrice: "gray",
};
const statusColors: Record<string, string> = {
  Active: "green",
  Completed: "blue",
  Cancelled: "red",
  Draft: "gray",
};
const bidderStatusLabels: Record<string, string> = {
  Leading: "Лидируете",
  Losing: "Проигрываете",
  Winner: "Победитель",
  NotParticipating: "Не участвуете",
  Outbid: "Перебита ставка",
};

function getBetAction(primaryAction: string) {
  if (primaryAction === "view_bets")
    return { search: { tab: "bets" as const } };
  if (primaryAction === "make_bet" || primaryAction === "change_bet")
    return { search: { action: "set-bet" as const } };
  return null;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

// eslint-disable-next-line complexity
export function MobileCard({ auction }: { auction: AuctionListItem }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return (
    <Card
      shadow="sm"
      padding="sm"
      withBorder
      style={{ cursor: "pointer" }}
      onMouseEnter={() => {
        void queryClient.prefetchQuery({
          queryKey: ["auction", auction.uuid],
          queryFn: () => fetchAuctionDetail(auction.uuid),
        });
      }}
      onClick={() =>
        void navigate({
          to: "/auctions/$auctionUuid",
          params: { auctionUuid: auction.uuid },
        })
      }
    >
      <Stack gap={6}>
        <Group gap="xs" wrap="wrap">
          <Text fw={700} size="sm">
            {auction.cargo_num}
          </Text>
          <Badge
            color={auctionTypeColors[auction.auc_type]!}
            variant="light"
            size="sm"
          >
            {auctionTypeLabels[auction.auc_type] ?? auction.auc_type}
          </Badge>
          <Badge
            color={statusColors[auction.status]!}
            variant="light"
            size="sm"
          >
            {auctionStatusLabels[auction.status] ?? auction.status}
          </Badge>
        </Group>
        <Group gap="xs" wrap="wrap" justify="space-between">
          <Text size="sm">
            {auction.load_city} → {auction.unload_city}
          </Text>
          <Text size="xs" c="dimmed">
            {auction.load_date
              ? new Date(auction.load_date).toLocaleDateString("ru-RU")
              : "—"}
          </Text>
        </Group>
        <Group gap="xs" wrap="wrap">
          <Text size="sm">{auction.cargo_name}</Text>
          {auction.cargo_weight !== null && (
            <Text size="xs" c="dimmed">
              {auction.cargo_weight} кг
            </Text>
          )}
          {auction.cargo_volume !== null && (
            <Text size="xs" c="dimmed">
              {auction.cargo_volume} м³
            </Text>
          )}
          {auction.body_type && (
            <Badge size="xs" variant="outline" color="gray">
              {auction.body_type}
            </Badge>
          )}
        </Group>
        <Group gap="xs" wrap="wrap" justify="space-between">
          <Group gap="xs">
            <Text size="sm" fw={500}>
              {auction.current_price <= 0
                ? "—"
                : formatPrice(auction.current_price)}
            </Text>
            {auction.price_per_km !== null && (
              <Text size="xs" c="dimmed">
                {formatPrice(auction.price_per_km)}/км
              </Text>
            )}
            <Text size="xs" c="dimmed">
              шаг {formatPrice(auction.bet_step)}
            </Text>
          </Group>
        </Group>
        <Group gap="xs" wrap="wrap" justify="space-between">
          <Group gap="xs">
            {auction.is_bet_present ? (
              <Badge color="blue" variant="light" size="sm">
                {bidderStatusLabels[auction.bidder_status] ??
                  auction.bidder_status}
              </Badge>
            ) : (
              <Text size="sm" c="dimmed">
                Нет ставки
              </Text>
            )}
          </Group>
          <Button
            size="xs"
            variant={
              auction.primary_action === "make_bet" ||
              auction.primary_action === "change_bet"
                ? "filled"
                : "light"
            }
            disabled={auction.primary_action === "disabled"}
            onClick={(e) => {
              e.stopPropagation();
              const action = getBetAction(auction.primary_action);
              if (action)
                void navigate({
                  to: "/auctions/$auctionUuid",
                  params: { auctionUuid: auction.uuid },
                  ...action,
                });
            }}
          >
            {actionLabels[auction.primary_action]}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
