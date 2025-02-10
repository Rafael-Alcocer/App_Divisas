import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/App_Divisas/", // 👈 Asegura que el base path es correcto
});
