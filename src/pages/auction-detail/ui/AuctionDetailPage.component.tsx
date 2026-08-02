import { useEffect } from "react";
import { useParams, useSearch, useNavigate } from "@tanstack/react-router";
import type { z } from "zod";
import {
  Title,
  Tabs,
  Stack,
  Box,
  Button,
  Group,
  ActionIcon,
  Skeleton,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuctionDetail } from "@/entities/auction";
import { AuctionCard } from "./AuctionCard.component";
import { BetList } from "./BetList.component";
import { BetForm } from "./BetForm.component";
import { useUiStore } from "../model/use-ui-store";
import type { detailSearchSchema } from "../model/detail-search.schema";
import { SuspenseBoundary } from "@/shared/ui";

type DetailSearch = z.infer<typeof detailSearchSchema>;

function DetailPageFallback() {
  return <Skeleton height={400} radius="sm" />;
}

function AuctionDetailPageInner() {
  const { auctionUuid } = useParams({ from: "/auctions/$auctionUuid" });
  const { data: auction } = useAuctionDetail(auctionUuid);
  const search = useSearch({ from: "/auctions/$auctionUuid" });

  const navigate = useNavigate();
  const {
    detailTab,
    betFormOpened,
    closeBetForm,
    setDetailTab,
    openBetForm,
    initFromUrl,
  } = useUiStore();

  const handleCloseBetForm = () => {
    closeBetForm();
    void navigate({
      to: ".",
      search: (prev: DetailSearch) => {
        const { action: _, ...rest } = prev;
        return rest;
      },
      replace: true,
    });
  };

  useEffect(() => {
    initFromUrl(search.tab, search.action === "set-bet");
  }, [search.action, search.tab]);

  return (
    <>
      <Tabs
        value={detailTab}
        onChange={(v) => {
          const tab = v as "detail" | "bets";
          setDetailTab(tab);
          void navigate({
            to: ".",
            search: (prev: DetailSearch) => ({ ...prev, tab }),
            replace: true,
          });
        }}
      >
        <Group mb="lg" gap="xs">
          <ActionIcon
            variant="subtle"
            size="md"
            onClick={() => window.history.back()}
            aria-label="Назад к списку"
          >
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Tabs.List>
            <Tabs.Tab value="detail">Детали аукциона</Tabs.Tab>
            <Tabs.Tab value="bets">Ставки</Tabs.Tab>
          </Tabs.List>
        </Group>

        <Tabs.Panel value="detail">
          <Stack gap="lg">
            <AuctionCard onBetClick={openBetForm} />

            {auction.hide_bets_history ? null : (
              <>
                <Title order={3}>История ставок</Title>
                <BetList />
              </>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="bets">
          {auction.hide_bets_history ? (
            <Box>
              <Title order={4} c="dimmed" ta="center" py="xl">
                История ставок скрыта
              </Title>
            </Box>
          ) : (
            <Stack gap="lg">
              <Group justify="space-between">
                <Title order={3}>История ставок</Title>
                {auction.trading.can_set_bet && (
                  <Button onClick={openBetForm} size="sm">
                    {auction.is_bet_present
                      ? "Изменить ставку"
                      : "Сделать ставку"}
                  </Button>
                )}
              </Group>
              <BetList />
            </Stack>
          )}
        </Tabs.Panel>
      </Tabs>

      <BetForm opened={betFormOpened} onClose={handleCloseBetForm} />
    </>
  );
}

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: "/auctions/$auctionUuid" });
  const queryClient = useQueryClient();

  return (
    <SuspenseBoundary
      loadingFallback={<DetailPageFallback />}
      onReset={() =>
        void queryClient.refetchQueries({
          queryKey: ["auction", auctionUuid],
        })
      }
    >
      <AuctionDetailPageInner />
    </SuspenseBoundary>
  );
}
