import { MantineProvider as BaseProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import type { ReactNode } from "react";

const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "Inter, system-ui, sans-serif",
});

export function MantineProvider({ children }: { children: ReactNode }) {
  return (
    <BaseProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-right" />
      {children}
    </BaseProvider>
  );
}
