import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Small Vite setup for React and Tailwind CSS.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
