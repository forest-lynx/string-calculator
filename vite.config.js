import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "StringCalculator",
      fileName: (format) => {
        if (format === "iife") return "string-calculator.min.js";
        if (format === "cjs") return "string-calculator.cjs.js";
        return `string-calculator.${format}.js`;
      },
      formats: ["es", "cjs", "iife"],
    },
    outDir: "dist",
    rollupOptions: {
      output: {
        globals: {
          "string-calculator": "StringCalculator",
        },
        exports: "named",
        compact: true,
        extend: true,
        name: "StringCalculator",
        footer: "window.StringCalculator = StringCalculator.StringCalculator;",
      },
    },
    minify: "esbuild",
    esbuild: {
      minify: true,
      keepNames: true,
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
