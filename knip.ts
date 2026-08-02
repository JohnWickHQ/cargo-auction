import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignoreExportsUsedInFile: {
    interface: true,
    type: true,
  },
  project: ["src/**/*.{ts,tsx}"],
  ignore: [
    "src/entities/auction/index.ts",
    "src/pages/auction-list/model/use-filters-sync.ts",
    "src/shared/api/msw/handlers.ts",
  ],
  ignoreDependencies: ["postcss-preset-mantine", "postcss-simple-vars"],
};

export default config;
