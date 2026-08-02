import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignoreExportsUsedInFile: {
    interface: true,
    type: true,
  },
  project: ["src/**/*.{ts,tsx}"],
  ignore: [
    // Barrel re-exports — types consumed through index.ts
    "src/entities/auction/index.ts",
  ],
  ignoreDependencies: ["postcss-preset-mantine", "postcss-simple-vars"],
};

export default config;
