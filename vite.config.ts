import { defineConfig } from "vite-plus";
import { wasm } from "rolldown-plugin-wasm";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  resolve: {
    tsconfigPaths: true,
  },
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
  pack: {
    entry: "src/index.ts",
    platform: "neutral",
    dts: {
      tsgo: true,
    },
    exports: true,
    minify: true,
    plugins: [wasm()],
    attw: {
      profile: "esm-only",
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
