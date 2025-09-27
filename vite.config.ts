import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [fresh(), tailwindcss()],
  build: {
    rollupOptions: {
      external: [
        "jsr:@b-fuze/deno-dom/native"
      ]
    }
  }
});
