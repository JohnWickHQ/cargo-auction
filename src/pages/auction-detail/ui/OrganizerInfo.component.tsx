import { memo } from "react";
import { Stack, Text, SimpleGrid } from "@mantine/core";
import type { Contact } from "@/shared/types";

interface OrganizerInfoProps {
  name: string;
  inn: string;
  hide_points_address_and_contacts: boolean;
  contacts: Contact | null;
}

export const OrganizerInfo = memo(function OrganizerInfo({
  name,
  inn,
  hide_points_address_and_contacts,
  contacts,
}: OrganizerInfoProps) {
  return (
    <Stack gap={2}>
      <Text size="xs" c="dimmed">
        Организатор
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
        <Stack gap={2}>
          <Text size="sm">{name}</Text>
          <Text size="xs" c="dimmed">
            ИНН {inn}
          </Text>
        </Stack>
        {!hide_points_address_and_contacts && contacts && (
          <Stack gap={2}>
            <Text size="sm">{contacts.person}</Text>
            <Text size="xs" c="dimmed">
              {contacts.phone} · {contacts.email}
            </Text>
          </Stack>
        )}
      </SimpleGrid>
      {hide_points_address_and_contacts && (
        <Text size="sm" c="dimmed" fs="italic">
          Контакты скрыты
        </Text>
      )}
    </Stack>
  );
});
