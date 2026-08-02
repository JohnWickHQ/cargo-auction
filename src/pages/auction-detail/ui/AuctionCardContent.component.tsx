import { memo } from "react";
import { Card, Group, Stack, Text, Title, Badge, Divider } from "@mantine/core";
import type { AuctionDetail } from "@/shared/types";
import {
  auctionTypeColors,
  auctionTypeLabels,
  statusColors,
  auctionStatusLabels,
} from "@/shared/config";
import { PriceBand } from "./PriceBand.component";
import { RouteInfo } from "./RouteInfo.component";
import { CargoInfo } from "./CargoInfo.component";
import { OrganizerInfo } from "./OrganizerInfo.component";
import { RoutePointTable } from "./RoutePointTable.component";

export const AuctionCardContent = memo(function AuctionCardContent({
  auction,
  onBetClick,
}: {
  auction: AuctionDetail;
  onBetClick?: () => void;
}) {
  return (
    <Card withBorder padding="lg">
      <Stack gap="md">
        <Group justify="space-between" wrap="wrap">
          <Title order={3}>Заявка {auction.cargo_num}</Title>
          <Group gap="sm">
            <Badge color={auctionTypeColors[auction.auc_type]!} size="lg">
              {auctionTypeLabels[auction.auc_type] ?? auction.auc_type}
            </Badge>
            <Badge color={statusColors[auction.status]!} size="lg">
              {auctionStatusLabels[auction.status] ?? auction.status}
            </Badge>
          </Group>
        </Group>

        {!auction.no_view_cargo_price && (
          <PriceBand
            auction={auction}
            {...(onBetClick ? { onBetClick } : {})}
          />
        )}

        <Divider />
        <RouteInfo auction={auction} />
        <CargoInfo auction={auction} />
        <OrganizerInfo auction={auction} />

        {auction.payment_terms && (
          <>
            <Divider />
            <Stack gap={2}>
              <Text size="xs" c="dimmed">
                Условия оплаты
              </Text>
              <Text size="sm">{auction.payment_terms}</Text>
            </Stack>
          </>
        )}

        {!auction.hide_points_address_and_contacts && (
          <>
            <Divider />
            <Stack gap="xs">
              <Text size="xs" c="dimmed">
                Маршрут
              </Text>
              <RoutePointTable routePoints={auction.route_points} />
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  );
});
