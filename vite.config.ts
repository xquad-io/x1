import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import wasm from "vite-plugin-wasm";
import { presetUno, presetWind } from "unocss";
import UnoCSS from "unocss/vite";

export default defineConfig(() => {
  return {
    plugins: [
      wasm(),
      qwikCity(),
      qwikVite(),
      tsconfigPaths(),
      UnoCSS({
        content: {
          filesystem: ['src/**/*.{ts,tsx}']
        },
        presets: [
          presetUno(), // required
          presetWind(),
        ],
      }),
    ],
    build: {
      target: "esnext",
      rollupOptions: {
        external: ["../../../src/utils/tiktoken_bg.wasm", "fs"],
      },
    },
    // esbuild: {target: },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
        // "Cross-Origin-Embedder-Policy": "require-corp",
        // "Cross-Origin-Opener-Policy": "same-origin",
      },
    },
  };
});
