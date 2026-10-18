import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // pendant npm run dev, tout appel a /api/... est transmis a Laravel
      "/api": { target: "http://127.0.0.1:8000" },
    },
  },
};
