import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000", // Your backend server
        changeOrigin: true, // Change the origin header to match the target
        secure: false, // If backend is using self-signed SSL, disable secure checking
        rewrite: (path) => path.replace(/^\/api/, ""), // Rewrite /api to match the backend paths
      },
    },
  },
});
