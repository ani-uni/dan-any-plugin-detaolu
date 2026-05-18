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
    dts: {
      tsgo: true,
    },
    exports: true,
    plugins: [wasm()],
    minify: true,
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
