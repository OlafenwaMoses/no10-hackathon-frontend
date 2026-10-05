import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import svgr from "vite-plugin-svgr";
import path from "path";

function blockApiImports(): Plugin {
  return {
    name: "block-api-imports",
    enforce: "pre",
    resolveId(source, importer) {
      if (!importer || importer.includes("node_modules")) return null;
      if (!importer.includes("/src/web/")) return null;

      const isApiImport =
        source.startsWith("../api/") ||
        source.startsWith("../../api/") ||
        source.includes("/src/api/");

      if (isApiImport && !source.endsWith("/types") && !source.endsWith("/types.ts")) {
        throw new Error(
          `Direct imports from api/ are not allowed (except types.ts). ` +
            `Use "import type" from "@api-types" instead.\n` +
            `  Importing: ${source}\n` +
            `  From: ${importer}`,
        );
      }

      return null;
    },
  };
}

export default defineConfig({
  build: {
    target: "esnext",
    modulePreload: { polyfill: false },
  },
  esbuild: {
    target: "esnext",
  },
  plugins: [
    blockApiImports(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "src/web/routes",
      generatedRouteTree: "src/web/routeTree.gen.ts",
    }),
    react({
      babel: {
        plugins: [
          "babel-plugin-react-compiler",
          ["@emotion/babel-plugin", { autoLabel: "always", labelFormat: "[local]" }],
        ],
      },
    }),
    svgr({
      svgrOptions: { svgo: false },
    }),
    cloudflare(),
  ],
  resolve: {
    alias: {
      "@api-types": path.resolve(__dirname, "src/api/types.ts"),
    },
  },
});
