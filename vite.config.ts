import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173, // optional, default Vite port
    proxy: {
      "/api": {
        target: "http://localhost:5000", // 👈 your Express backend
        changeOrigin: true,
        secure: false, // disable if you're using self-signed https
      },
    },
  },
});
