import { memo } from "react";
import { Stack, Text, Group, Badge } from "@mantine/core";
import type { AuctionDetail } from "@/shared/types";

export const CargoInfo = memo(function CargoInfo({
  auction,
}: {
  auction: AuctionDetail;
}) {
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
});
