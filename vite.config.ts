import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' makes all asset paths relative, so the build works on
// GitHub Pages regardless of the repository name (user.github.io/repo/).
export default defineConfig({
  plugins: [react()],
  base: './',
});
