import { useParams } from "@tanstack/react-router";
import { Skeleton, Stack } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useAuctionDetail } from "@/entities/auction";
import { SuspenseBoundary } from "@/shared/ui";
import { AuctionCardContent } from "./AuctionCardContent.component";

function AuctionCardFallback() {
  return (
    <Stack>
      <Skeleton height={40} />
      <Skeleton height={200} />
      <Skeleton height={150} />
    </Stack>
  );
}

function AuctionCardInner({ onBetClick }: { onBetClick?: () => void }) {
  const { auctionUuid } = useParams({ from: "/auctions/$auctionUuid" });
  const { data: auction } = useAuctionDetail(auctionUuid);

  if (onBetClick) {
    return <AuctionCardContent auction={auction} onBetClick={onBetClick} />;
  }
  return <AuctionCardContent auction={auction} />;
}

export function AuctionCard({ onBetClick }: { onBetClick?: () => void }) {
  const { auctionUuid } = useParams({ from: "/auctions/$auctionUuid" });
  const queryClient = useQueryClient();

  const inner = onBetClick ? (
    <AuctionCardInner onBetClick={onBetClick} />
  ) : (
    <AuctionCardInner />
  );

  return (
    <SuspenseBoundary
      loadingFallback={<AuctionCardFallback />}
      onReset={() =>
        void queryClient.refetchQueries({
          queryKey: ["auction", auctionUuid],
        })
      }
    >
      {inner}
    </SuspenseBoundary>
  );
}
