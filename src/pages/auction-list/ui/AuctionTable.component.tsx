import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, Text, Pagination, Center, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useAuctionList } from "@/entities/auction";
import { useFiltersSync } from "../model/use-filters-sync";
import type { AuctionListRequest } from "@/shared/types";
import { SuspenseBoundary } from "@/shared/ui";
import { DesktopRow } from "./DesktopRow.component";
import { MobileCard } from "./MobileCard.component";

function AuctionTableInner() {
  const [filters, setFilters] = useFiltersSync();
  const isMobile = useMediaQuery("(max-width: 1050px)");

  const queryParams = useMemo<AuctionListRequest>(
    // eslint-disable-next-line complexity
    () => {
      const params: AuctionListRequest = {
        page: filters.page ?? 1,
        per_page: filters.per_page ?? 20,
      };
      if (filters.cargo_num !== undefined) params.cargo_num = filters.cargo_num;
      if (filters.status !== undefined) params.status = filters.status;
      if (filters.statuses !== undefined) params.statuses = filters.statuses;
      if (filters.auc_type !== undefined) params.auc_type = filters.auc_type;
      if (filters.load_city !== undefined) params.load_city = filters.load_city;
      if (filters.unload_city !== undefined)
        params.unload_city = filters.unload_city;
      if (filters.load_date_from !== undefined)
        params.load_date_from = filters.load_date_from;
      if (filters.load_date_to !== undefined)
        params.load_date_to = filters.load_date_to;
      if (filters.price_from !== undefined)
        params.price_from = filters.price_from;
      if (filters.price_to !== undefined) params.price_to = filters.price_to;
      if (filters.is_available !== undefined)
        params.is_available = filters.is_available === "true";
      if (filters.is_bidder !== undefined)
        params.is_bidder = filters.is_bidder === "true";
      return params;
    },
    [filters]
  );

  const { data } = useAuctionList(queryParams);

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

export function AuctionTable() {
  const queryClient = useQueryClient();

  return (
    <SuspenseBoundary
      onReset={() =>
        void queryClient.refetchQueries({ queryKey: ["auctions"] })
      }
    >
      <AuctionTableInner />
    </SuspenseBoundary>
  );
}
