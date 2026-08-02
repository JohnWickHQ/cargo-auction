import { useEffect, useState, type ReactNode } from "react";

function MswSpinner() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      Загрузка MSW...
    </div>
  );
}

export function MswProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!import.meta.env.DEV);

  useEffect(() => {
    if (import.meta.env.DEV) {
      void import("@/shared/api/msw/browser").then(({ initMsw }) => {
        void initMsw().then(() => setReady(true));
      });
    }
  }, []);

  if (!ready) {
    return <MswSpinner />;
  }

  return <>{children}</>;
}
