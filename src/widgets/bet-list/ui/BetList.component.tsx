import { useParams } from "@tanstack/react-router";
import { useBets } from "@/entities/bet";
import {
  Stack,
  Table,
  Skeleton,
  Alert,
  Center,
  Text,
  Badge,
  Group,
  Button,
} from "@mantine/core";
import { IconAlertCircle, IconCoinOff } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

export function BetList() {
  const { auctionUuid } = useParams({ from: "/auctions/$auctionUuid" });
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useBets(auctionUuid);

  if (isLoading) {
    return (
      <Stack>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height={60} />
        ))}
      </Stack>
    );
  }

  if (isError) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Ошибка загрузки"
        color="red"
      >
        <Text size="sm">{(error as Error).message}</Text>
        <Button
          variant="white"
          color="red"
          size="xs"
          mt="sm"
          onClick={() =>
            void queryClient.refetchQueries({ queryKey: ["bets", auctionUuid] })
          }
        >
          Повторить
        </Button>
      </Alert>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <Center py="xl">
        <Stack align="center" gap="sm">
          <IconCoinOff size={48} color="var(--mantine-color-gray-5)" />
          <Text c="dimmed" size="lg">
            Ставок пока нет
          </Text>
          <Text c="dimmed" size="sm">
            Будьте первым, кто сделает ставку
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack>
      <Group>
        <Text size="sm" c="dimmed">
          Участников: {data.total_participants}
        </Text>
      </Group>
      <Table striped highlightOnHover withRowBorders withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Место</Table.Th>
            <Table.Th>Перевозчик</Table.Th>
            <Table.Th>Цена</Table.Th>
            <Table.Th>С НДС</Table.Th>
            <Table.Th>Дата</Table.Th>
            <Table.Th>Статус</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.items.map((bet) => (
            <Table.Tr key={bet.uuid} opacity={bet.is_cancelled ? 0.5 : 1}>
              <Table.Td>{bet.rank ?? "—"}</Table.Td>
              <Table.Td>{bet.carrier_name}</Table.Td>
              <Table.Td>{formatPrice(bet.price)}</Table.Td>
              <Table.Td>{formatPrice(bet.price_with_vat)}</Table.Td>
              <Table.Td>
                {new Date(bet.created_at).toLocaleString("ru-RU")}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {bet.is_winner && (
                    <Badge color="green" size="sm">
                      Победитель
                    </Badge>
                  )}
                  {bet.is_cancelled && (
                    <Badge color="red" size="sm">
                      Отменена
                    </Badge>
                  )}
                </Group>
                {bet.cancel_reason && (
                  <Text size="xs" c="dimmed">
                    {bet.cancel_reason}
                  </Text>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
