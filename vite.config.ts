import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');
  
  // On Vercel, system environment variables are available in process.env
  // We prioritize the loaded env (which includes system envs locally if configured) 
  // or fallback to process.env for the build server.
  const apiKey = env.API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // String replacement for the API key in the client-side code
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
    server: {
      port: 3000,
    },
  };
});