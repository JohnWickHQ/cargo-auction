import { memo } from "react";
import { Stack, Text, Group, Badge } from "@mantine/core";

interface CargoInfoProps {
  cargo_name: string;
  cargo_weight: number | null;
  cargo_volume: number | null;
  body_type: string | null;
  cargo_requirements: string | null;
}

export const CargoInfo = memo(function CargoInfo({
  cargo_name,
  cargo_weight,
  cargo_volume,
  body_type,
  cargo_requirements,
}: CargoInfoProps) {
  return (
    <Stack gap={2}>
      <Text size="xs" c="dimmed">
        Груз
      </Text>
      <Group gap="xs" wrap="wrap">
        <Text size="sm" fw={500}>
          {cargo_name}
        </Text>
        {cargo_weight !== null && (
          <Text size="sm" c="dimmed">
            · {cargo_weight} кг
          </Text>
        )}
        {cargo_volume !== null && (
          <Text size="sm" c="dimmed">
            · {cargo_volume} м³
          </Text>
        )}
        {body_type && (
          <Badge size="sm" variant="outline" color="gray">
            {body_type}
          </Badge>
        )}
      </Group>
      {cargo_requirements && (
        <Text size="sm" c="dimmed">
          {cargo_requirements}
        </Text>
      )}
    </Stack>
  );
});
