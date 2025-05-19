import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), ''); // aún se puede cargar .env por si se usa en otros lados

  console.log("API URL usada por Vite:", "http://localhost:3000/api");

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify("http://localhost:3000/api"),
    },
  };
});
