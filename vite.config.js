import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  console.log('API URL usada por Vite:', env.VITE_API_URL);

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL)
    },
  };
});
