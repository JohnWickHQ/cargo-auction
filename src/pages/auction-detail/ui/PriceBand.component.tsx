import { memo } from "react";
import {
  Box,
  SimpleGrid,
  Stack,
  Text,
  Badge,
  Group,
  Button,
} from "@mantine/core";
import type { Trading } from "@/shared/types";
import { bidderStatusLabels, formatPrice } from "@/shared/config";

interface PriceBandProps {
  trading: Trading;
  is_bet_present: boolean;
  onBetClick?: () => void;
}

export const PriceBand = memo(function PriceBand({
  trading,
  is_bet_present,
  onBetClick,
}: PriceBandProps) {
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
            {formatPrice(trading.current_price)}
          </Text>
        </Stack>
        {trading.min_price !== null && (
          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              Мин. цена
            </Text>
            <Text size="sm">{formatPrice(trading.min_price)}</Text>
          </Stack>
        )}
        {trading.max_price !== null && (
          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              Макс. цена
            </Text>
            <Text size="sm">{formatPrice(trading.max_price)}</Text>
          </Stack>
        )}
        <Stack gap={2}>
          <Text size="xs" c="dimmed">
            Шаг ставки
          </Text>
          <Text size="sm">{formatPrice(trading.bet_step)}</Text>
        </Stack>
      </SimpleGrid>
      <Group justify="space-between" mt="md" wrap="wrap">
        <Badge
          color={is_bet_present ? "blue" : "gray"}
          variant="light"
          size="lg"
        >
          {bidderStatusLabels[trading.bidder_status]}
        </Badge>
        {trading.can_set_bet ? (
          <Button onClick={onBetClick}>
            {is_bet_present ? "Изменить ставку" : "Сделать ставку"}
          </Button>
        ) : (
          <Button disabled>Ставки недоступны</Button>
        )}
      </Group>
    </Box>
  );
});
