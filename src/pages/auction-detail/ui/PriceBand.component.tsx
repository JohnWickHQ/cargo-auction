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
import type { AuctionDetail } from "@/shared/types";
import { bidderStatusLabels, formatPrice } from "@/shared/config";

export const PriceBand = memo(function PriceBand({
  auction,
  onBetClick,
}: {
  auction: AuctionDetail;
  onBetClick?: () => void;
}) {
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
          <Button onClick={onBetClick}>
            {auction.is_bet_present ? "Изменить ставку" : "Сделать ставку"}
          </Button>
        ) : (
          <Button disabled>Ставки недоступны</Button>
        )}
      </Group>
    </Box>
  );
});
