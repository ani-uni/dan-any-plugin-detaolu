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
  worker: {
    format: "es",
  },
  pack: {
    dts: {
      tsgo: true,
    },
    exports: true,
    plugins: [wasm()],
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
