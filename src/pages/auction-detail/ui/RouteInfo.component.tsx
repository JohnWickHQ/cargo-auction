import { memo } from "react";
import { SimpleGrid, Stack, Text } from "@mantine/core";
import { formatDate } from "@/shared/config";

interface RouteInfoProps {
  load_city: string;
  unload_city: string;
  load_date: string | null;
  unload_date: string | null;
}

export const RouteInfo = memo(function RouteInfo({
  load_city,
  unload_city,
  load_date,
  unload_date,
}: RouteInfoProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
      <Stack gap={2}>
        <Text size="xs" c="dimmed">
          Маршрут
        </Text>
        <Text size="sm">
          {load_city} → {unload_city}
        </Text>
      </Stack>
      <Stack gap={2}>
        <Text size="xs" c="dimmed">
          Даты
        </Text>
        <Text size="sm">
          {formatDate(load_date)}
          {" — "}
          {formatDate(unload_date)}
        </Text>
      </Stack>
    </SimpleGrid>
  );
});
