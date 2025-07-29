import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig(({ command }) => {
  return {
    server: {
      port: 5173,
      strictPort: true,
      cors: { origin: "http://localhost:4000" },
    },
    resolve: {
      conditions: ["svelte", "browser", "import", "default"],
      alias: {
        $lib: path.resolve("./js/lib"),
      },
    },
    build: {
      manifest: true,
      rollupOptions: {
        input: ["js/app.js", "css/app.css"],
      },
      outDir: "../priv/static",
      emptyOutDir: true,
    },
    plugins: [
      tailwindcss(),
      svelte({
        preprocess: [vitePreprocess()],
        compilerOptions: {
          modernAst: true,
          hmr: true,
          dev: command !== "build",
        },
      }),
    ],
  };
});
