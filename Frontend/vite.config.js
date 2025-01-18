import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@components": path.resolve(__dirname, "src/components"),
        "@context": path.resolve(__dirname, "src/context"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@constants": path.resolve(__dirname, "src/constants"),
        "@layout": path.resolve(__dirname, "src/layout"),
      },
    },
    server: {
      host: true,
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      minify: "terser",
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
          },
        },
      },
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(env.VITE_NODE_ENV),
    },
  };
});
