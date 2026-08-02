import { memo } from "react";
import { Stack, Text, SimpleGrid } from "@mantine/core";
import type { AuctionDetail } from "@/shared/types";

export const OrganizerInfo = memo(function OrganizerInfo({
  auction,
}: {
  auction: AuctionDetail;
}) {
  return (
    <Stack gap={2}>
      <Text size="xs" c="dimmed">
        Организатор
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
        <Stack gap={2}>
          <Text size="sm">{auction.organizer.name}</Text>
          <Text size="xs" c="dimmed">
            ИНН {auction.organizer.inn}
          </Text>
        </Stack>
        {!auction.hide_points_address_and_contacts && auction.contacts && (
          <Stack gap={2}>
            <Text size="sm">{auction.contacts.person}</Text>
            <Text size="xs" c="dimmed">
              {auction.contacts.phone} · {auction.contacts.email}
            </Text>
          </Stack>
        )}
      </SimpleGrid>
      {auction.hide_points_address_and_contacts && (
        <Text size="sm" c="dimmed" fs="italic">
          Контакты скрыты
        </Text>
      )}
    </Stack>
  );
});
