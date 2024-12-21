import * as path from "path";
import react from "@vitejs/plugin-react-swc";
import zipPack from "vite-plugin-zip-pack";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  root: "./src/app",
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/app")
    }
  },
  build: {
    outDir: "../../dist"
  }
});
