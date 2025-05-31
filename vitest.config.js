/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',  // Si necesitas código de setup adicional (por ejemplo, polyfills).

    // ------------------------------------------
    // Configuración de generación de cobertura
    // ------------------------------------------
    coverage: {
      provider: 'istanbul',            // Usa Istanbul (requiere @vitest/coverage-istanbul instalado)
      reporter: ['text', 'lcov'],      // Muestra resumen en consola y genera lcov.info
      reportsDirectory: 'coverage',    // Carpeta de salida para reportes
      all: true,                       // Incluir todos los archivos de src, incluso si no tienen tests
      include: ['src/**/*.js', 'src/**/*.jsx'],  // Ajusta según tu estructura de carpetas
      exclude: [
        'node_modules/',
        'tests/',
        'vitest.config.js',
        'vite.config.js'
      ],

      // Umbrales mínimos. Si no se cumplen, Vitest fallará.
      statements: 80,
      branches: 70,
      functions: 75,
      lines: 80
    }
  }
})
