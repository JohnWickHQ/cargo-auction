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
  const {
    cargo_num,
    auc_type,
    status,
    no_view_cargo_price,
    trading,
    is_bet_present,
    load_city,
    unload_city,
    load_date,
    unload_date,
    cargo_name,
    cargo_weight,
    cargo_volume,
    body_type,
    cargo_requirements,
    organizer,
    contacts,
    hide_points_address_and_contacts,
    payment_terms,
    route_points,
  } = auction;

  return (
    <Card withBorder padding="lg">
      <Stack gap="md">
        <Group justify="space-between" wrap="wrap">
          <Title order={3}>Заявка {cargo_num}</Title>
          <Group gap="sm">
            <Badge color={auctionTypeColors[auc_type]} size="lg">
              {auctionTypeLabels[auc_type]}
            </Badge>
            <Badge color={statusColors[status]} size="lg">
              {auctionStatusLabels[status]}
            </Badge>
          </Group>
        </Group>

        {!no_view_cargo_price &&
          (onBetClick ? (
            <PriceBand
              trading={trading}
              is_bet_present={is_bet_present}
              onBetClick={onBetClick}
            />
          ) : (
            <PriceBand trading={trading} is_bet_present={is_bet_present} />
          ))}

        <Divider />
        <RouteInfo
          load_city={load_city}
          unload_city={unload_city}
          load_date={load_date}
          unload_date={unload_date}
        />
        <CargoInfo
          cargo_name={cargo_name}
          cargo_weight={cargo_weight}
          cargo_volume={cargo_volume}
          body_type={body_type}
          cargo_requirements={cargo_requirements}
        />
        <OrganizerInfo
          name={organizer.name}
          inn={organizer.inn}
          hide_points_address_and_contacts={hide_points_address_and_contacts}
          contacts={contacts}
        />

        {payment_terms && (
          <>
            <Divider />
            <Stack gap={2}>
              <Text size="xs" c="dimmed">
                Условия оплаты
              </Text>
              <Text size="sm">{payment_terms}</Text>
            </Stack>
          </>
        )}

        {!hide_points_address_and_contacts && (
          <>
            <Divider />
            <Stack gap="xs">
              <Text size="xs" c="dimmed">
                Маршрут
              </Text>
              <RoutePointTable routePoints={route_points} />
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  );
});
