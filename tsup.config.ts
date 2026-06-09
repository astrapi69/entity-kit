import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  // React, react-dom and TanStack Table are peer dependencies; entity-kit-core
  // is a regular dependency. None of them must be bundled into the output.
  external: [
    "react",
    "react-dom",
    "@tanstack/react-table",
    "@astrapi69/entity-kit-core",
  ],
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".js" };
  },
});
