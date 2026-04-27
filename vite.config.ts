import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouterDevTools } from "react-router-devtools";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  ssr: {
    noExternal: [],
  },

  plugins: [
    reactRouterDevTools(),
    tailwindcss(),
    mdx(),
    reactRouter(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
