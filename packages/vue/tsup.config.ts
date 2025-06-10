import { defineConfig } from "tsup"

export default defineConfig({
  entry: [
    "src/index.ts"
  ],
  format: [
    "esm",
    "cjs"
  ],
  dts: true,
  platform: "neutral",
  splitting: false,
  sourcemap: true,
  clean: true,
  skipNodeModulesBundle: true
})
