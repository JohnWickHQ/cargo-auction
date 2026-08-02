import {
  createRootRoute,
  Outlet,
  useRouterState,
  Link,
} from "@tanstack/react-router";
import { Container, Group, Title, Anchor } from "@mantine/core";
import { ColorSchemeToggle } from "@/shared/ui";

function RootLayout() {
  const state = useRouterState();
  const isDetailPage =
    state.location.pathname.startsWith("/auctions/") &&
    state.location.pathname !== "/auctions";

  return (
    <Container size="xl" py="lg">
      <Group justify="space-between" mb="md">
        {isDetailPage ? (
          <Anchor component={Link} to="/auctions" underline="never" c="inherit">
            <Title order={1}>Грузовые аукционы</Title>
          </Anchor>
        ) : (
          <Title order={1}>Грузовые аукционы</Title>
        )}
        <ColorSchemeToggle />
      </Group>
      <Outlet />
    </Container>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
