/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,  
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',  // si tienes código de setup extra para tus tests

    // ------------------------------------------
    // Configuración de generación de cobertura
    // ------------------------------------------
    coverage: {
      provider: 'istanbul',            // Usa Istanbul para recolectar coverage
      reporter: ['text', 'lcov'],      // Mostrará resumen en consola y siempre escribirá lcov.info
      reportsDirectory: 'coverage',    // Carpeta donde depositar reporte de coverage
      all: true,                       // Incluir todos los archivos (incluso sin importar tests)
      include: ['src/**/*.js', 'src/**/*.jsx'],  // Ajusta según tu estructura (puedes incluir .ts/.tsx también)
      exclude: ['node_modules/', 'tests/', 'vitest.config.js', 'vite.config.js'],

      // (Opcional) Umbrales mínimos. Si coverage < estos valores, Vitest falla.
      statements: 80,
      branches: 70,
      functions: 75,
      lines: 80
    }
  }
})
