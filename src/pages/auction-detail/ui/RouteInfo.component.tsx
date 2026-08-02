import { memo } from "react";
import { SimpleGrid, Stack, Text } from "@mantine/core";
import type { AuctionDetail } from "@/shared/types";

export const RouteInfo = memo(function RouteInfo({
  auction,
}: {
  auction: AuctionDetail;
}) {
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
});
