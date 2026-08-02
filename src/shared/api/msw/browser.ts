import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

export async function initMsw() {
  if (import.meta.env.DEV) {
    return worker.start({ onUnhandledRequest: "bypass" });
  }
}
