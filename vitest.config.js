/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.js",

    // Incluir tests de React y Selenium
    include: ["src/**/*.test.{js,jsx}", "tests/**/*.selenium.test.js"],

    coverage: {
      provider: "istanbul",
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage",
      all: true,
      include: ["src/**/*.js", "src/**/*.jsx"],
      exclude: [
        "node_modules/",
        "tests/",
        "vitest.config.js",
        "vite.config.js"
      ],

      // Umbrales opcionales (si coverage baja de aquí, Vitest falla)
      statements: 80,
      branches: 70,
      functions: 75,
      lines: 80
    }
  }
});
