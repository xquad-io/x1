import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import wasm from "vite-plugin-wasm";


export default defineConfig(() => {
  return {
    plugins: [wasm(), qwikCity(), qwikVite(), tsconfigPaths()],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin'
      },
    },
  };
});
