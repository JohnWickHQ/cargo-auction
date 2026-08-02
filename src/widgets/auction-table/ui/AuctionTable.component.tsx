import { useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Skeleton,
  Alert,
  Text,
  Pagination,
  Center,
  Stack,
  Button,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconAlertCircle, IconSearch } from "@tabler/icons-react";
import { useAuctionList } from "@/entities/auction";
import { useFiltersSync } from "@/features/filter-auctions";
import type { AuctionListRequest } from "@/shared/types";
import { DesktopRow } from "./DesktopRow.component";
import { MobileCard } from "./MobileCard.component";

export function AuctionTable() {
  const [filters, setFilters] = useFiltersSync();
  const isMobile = useMediaQuery("(max-width: 1050px)");
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useAuctionList({
    ...filters,
    page: filters.page ?? 1,
    per_page: filters.per_page ?? 20,
    is_available:
      filters.is_available !== undefined
        ? filters.is_available === "true"
        : undefined,
    is_bidder:
      filters.is_bidder !== undefined
        ? filters.is_bidder === "true"
        : undefined,
  } as AuctionListRequest);

  if (isLoading) {
    return (
      <Stack>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={isMobile ? 140 : 50} radius="sm" />
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
        variant="filled"
      >
        <Text size="sm">{(error as Error).message}</Text>
        <Button
          variant="white"
          color="red"
          size="xs"
          mt="sm"
          onClick={() =>
            void queryClient.refetchQueries({ queryKey: ["auctions"] })
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
          <IconSearch size={48} color="var(--mantine-color-gray-5)" />
          <Text c="dimmed" size="lg">
            Аукционы не найдены
          </Text>
          <Text c="dimmed" size="sm">
            Попробуйте изменить параметры фильтрации
          </Text>
        </Stack>
      </Center>
    );
  }

  const totalPages = Math.ceil(data.total / data.per_page);

  return (
    <Stack>
      {isMobile ? (
        <Stack gap="sm">
          {data.items.map((auction) => (
            <MobileCard key={auction.uuid} auction={auction} />
          ))}
        </Stack>
      ) : (
        <Table striped highlightOnHover withRowBorders withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Заявка</Table.Th>
              <Table.Th>Тип</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Маршрут</Table.Th>
              <Table.Th>Дата погрузки</Table.Th>
              <Table.Th>Груз</Table.Th>
              <Table.Th>Цена</Table.Th>
              <Table.Th>Ставка</Table.Th>
              <Table.Th>Действие</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.items.map((auction) => (
              <DesktopRow key={auction.uuid} auction={auction} />
            ))}
          </Table.Tbody>
        </Table>
      )}

      {totalPages > 1 && (
        <Center>
          <Pagination
            total={totalPages}
            value={filters.page ?? 1}
            onChange={(page) => setFilters({ page })}
          />
        </Center>
      )}
    </Stack>
  );
}
