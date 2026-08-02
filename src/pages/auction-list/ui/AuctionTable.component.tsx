import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, Text, Pagination, Center, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useAuctionList } from "@/entities/auction";
import { useFiltersSync } from "../model/use-filters-sync";
import { filtersToRequestParams } from "../model/request-params";
import { SuspenseBoundary } from "@/shared/ui";
import { DesktopRow } from "./DesktopRow.component";
import { MobileCard } from "./MobileCard.component";

function AuctionTableInner() {
  const [filters, setFilters] = useFiltersSync();
  const isMobile = useMediaQuery("(max-width: 1050px)");

  const queryParams = useMemo(() => filtersToRequestParams(filters), [filters]);

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
