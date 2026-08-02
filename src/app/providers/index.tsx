import type { ReactNode } from "react";
import { MantineProvider } from "./MantineProvider";
import { QueryProvider } from "./QueryProvider";
import { MswProvider } from "./MswProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MswProvider>
      <QueryProvider>
        <MantineProvider>{children}</MantineProvider>
      </QueryProvider>
    </MswProvider>
  );
}
