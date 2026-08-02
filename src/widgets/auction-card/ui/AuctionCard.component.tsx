/* eslint-disable max-lines */ import { useParams } from "@tanstack/react-router";
import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Skeleton,
  Alert,
  Button,
  Table,
  Divider,
  SimpleGrid,
  Box,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAuctionDetail, type AuctionDetail } from "@/entities/auction";
import { useUiStore } from "@/shared/lib";

const auctionTypeColors: Record<string, string> = {
  Request: "blue",
  Up: "green",
  Down: "red",
  FixPrice: "gray",
};
const auctionTypeLabels: Record<string, string> = {
  Request: "Заявка",
  Up: "Повышение",
  Down: "Понижение",
  FixPrice: "Фикс. цена",
};
const statusColors: Record<string, string> = {
  Active: "green",
  Completed: "blue",
  Cancelled: "red",
  Draft: "gray",
};
const auctionStatusLabels: Record<string, string> = {
  Active: "Активен",
  Completed: "Завершён",
  Cancelled: "Отменён",
  Draft: "Черновик",
};
const bidderStatusLabels: Record<string, string> = {
  Leading: "Лидируете",
  Losing: "Проигрываете",
  Winner: "Победитель",
  NotParticipating: "Не участвуете",
  Outbid: "Перебита ставка",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

function PriceBand({ auction }: { auction: AuctionDetail }) {
  const { openBetForm } = useUiStore();
  return (
    <Box
      bg="var(--mantine-color-gray-light)"
      style={{ borderRadius: "var(--mantine-radius-md)" }}
      p="md"
    >
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
        <Stack gap={2}>
          <Text size="xs" c="dimmed">
            Текущая цена
          </Text>
          <Text size="lg" fw={700}>
            {formatPrice(auction.trading.current_price)}
          </Text>
        </Stack>
        {auction.trading.min_price !== null &&
          auction.trading.min_price !== undefined && (
            <Stack gap={2}>
              <Text size="xs" c="dimmed">
                Мин. цена
              </Text>
              <Text size="sm">{formatPrice(auction.trading.min_price)}</Text>
            </Stack>
          )}
        {auction.trading.max_price !== null &&
          auction.trading.max_price !== undefined && (
            <Stack gap={2}>
              <Text size="xs" c="dimmed">
                Макс. цена
              </Text>
              <Text size="sm">{formatPrice(auction.trading.max_price)}</Text>
            </Stack>
          )}
        <Stack gap={2}>
          <Text size="xs" c="dimmed">
            Шаг ставки
          </Text>
          <Text size="sm">{formatPrice(auction.trading.bet_step)}</Text>
        </Stack>
      </SimpleGrid>
      <Group justify="space-between" mt="md" wrap="wrap">
        <Badge
          color={auction.is_bet_present ? "blue" : "gray"}
          variant="light"
          size="lg"
        >
          {bidderStatusLabels[auction.trading.bidder_status] ??
            auction.trading.bidder_status}
        </Badge>
        {auction.trading.can_set_bet ? (
          <Button onClick={openBetForm}>
            {auction.is_bet_present ? "Изменить ставку" : "Сделать ставку"}
          </Button>
        ) : (
          <Button disabled>Ставки недоступны</Button>
        )}
      </Group>
    </Box>
  );
}

function RouteInfo({ auction }: { auction: AuctionDetail }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
      <Stack gap={2}>
        <Text size="xs" c="dimmed">
          Маршрут
        </Text>
        <Text size="sm">
          {auction.load_city} → {auction.unload_city}
        </Text>
      </Stack>
      <Stack gap={2}>
        <Text size="xs" c="dimmed">
          Даты
        </Text>
        <Text size="sm">
          {auction.load_date
            ? new Date(auction.load_date).toLocaleDateString("ru-RU")
            : "—"}
          {" — "}
          {auction.unload_date
            ? new Date(auction.unload_date).toLocaleDateString("ru-RU")
            : "—"}
        </Text>
      </Stack>
    </SimpleGrid>
  );
}

function CargoInfo({ auction }: { auction: AuctionDetail }) {
  return (
    <Stack gap={2}>
      <Text size="xs" c="dimmed">
        Груз
      </Text>
      <Group gap="xs" wrap="wrap">
        <Text size="sm" fw={500}>
          {auction.cargo_name}
        </Text>
        {auction.cargo_weight !== null && (
          <Text size="sm" c="dimmed">
            · {auction.cargo_weight} кг
          </Text>
        )}
        {auction.cargo_volume !== null && (
          <Text size="sm" c="dimmed">
            · {auction.cargo_volume} м³
          </Text>
        )}
        {auction.body_type && (
          <Badge size="sm" variant="outline" color="gray">
            {auction.body_type}
          </Badge>
        )}
      </Group>
      {auction.cargo_requirements && (
        <Text size="sm" c="dimmed">
          {auction.cargo_requirements}
        </Text>
      )}
    </Stack>
  );
}

function OrganizerInfo({ auction }: { auction: AuctionDetail }) {
  return (
    <Stack gap={2}>
      <Text size="xs" c="dimmed">
        Организатор
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
        <Stack gap={2}>
          <Text size="sm">{auction.organizer.name}</Text>
          <Text size="xs" c="dimmed">
            ИНН {auction.organizer.inn}
          </Text>
        </Stack>
        {!auction.hide_points_address_and_contacts && auction.contacts && (
          <Stack gap={2}>
            <Text size="sm">{auction.contacts.person}</Text>
            <Text size="xs" c="dimmed">
              {auction.contacts.phone} · {auction.contacts.email}
            </Text>
          </Stack>
        )}
      </SimpleGrid>
      {auction.hide_points_address_and_contacts && (
        <Text size="sm" c="dimmed" fs="italic">
          Контакты скрыты
        </Text>
      )}
    </Stack>
  );
}

function RoutePointTable({
  routePoints,
}: {
  routePoints: AuctionDetail["route_points"];
}) {
  return (
    <Table striped withRowBorders withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Тип</Table.Th>
          <Table.Th>Город</Table.Th>
          <Table.Th>Адрес</Table.Th>
          <Table.Th>Дата</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {routePoints.map((point, i) => (
          <Table.Tr key={i}>
            <Table.Td>
              {point.type === "loading" ? "Погрузка" : "Разгрузка"}
            </Table.Td>
            <Table.Td>{point.city}</Table.Td>
            <Table.Td>{point.address || "—"}</Table.Td>
            <Table.Td>
              {new Date(point.date).toLocaleDateString("ru-RU")}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

function AuctionCardContent({ auction }: { auction: AuctionDetail }) {
  return (
    <Card withBorder padding="lg">
      <Stack gap="md">
        <Group justify="space-between" wrap="wrap">
          <Title order={3}>Заявка {auction.cargo_num}</Title>
          <Group gap="sm">
            <Badge color={auctionTypeColors[auction.auc_type]!} size="lg">
              {auctionTypeLabels[auction.auc_type] ?? auction.auc_type}
            </Badge>
            <Badge color={statusColors[auction.status]!} size="lg">
              {auctionStatusLabels[auction.status] ?? auction.status}
            </Badge>
          </Group>
        </Group>

        {!auction.no_view_cargo_price && <PriceBand auction={auction} />}

        <Divider />
        <RouteInfo auction={auction} />
        <CargoInfo auction={auction} />
        <OrganizerInfo auction={auction} />

        {auction.payment_terms && (
          <>
            <Divider />
            <Stack gap={2}>
              <Text size="xs" c="dimmed">
                Условия оплаты
              </Text>
              <Text size="sm">{auction.payment_terms}</Text>
            </Stack>
          </>
        )}

        {!auction.hide_points_address_and_contacts && (
          <>
            <Divider />
            <Stack gap="xs">
              <Text size="xs" c="dimmed">
                Маршрут
              </Text>
              <RoutePointTable routePoints={auction.route_points} />
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  );
}

export function AuctionCard() {
  const { auctionUuid } = useParams({ from: "/auctions/$auctionUuid" });
  const queryClient = useQueryClient();
  const {
    data: auction,
    isLoading,
    isError,
    error,
  } = useAuctionDetail(auctionUuid);

  if (isLoading) {
    return (
      <Stack>
        <Skeleton height={40} />
        <Skeleton height={200} />
        <Skeleton height={150} />
      </Stack>
    );
  }

  if (isError || !auction) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Ошибка загрузки"
        color="red"
        variant="filled"
      >
        <Text size="sm">
          {(error as Error)?.message ?? "Аукцион не найден"}
        </Text>
        <Button
          variant="white"
          color="red"
          size="xs"
          mt="sm"
          onClick={() =>
            void queryClient.refetchQueries({
              queryKey: ["auction", auctionUuid],
            })
          }
        >
          Повторить
        </Button>
      </Alert>
    );
  }

  return <AuctionCardContent auction={auction} />;
}
