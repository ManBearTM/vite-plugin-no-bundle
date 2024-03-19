import { defineConfig } from 'vite';
import noBundle from 'vite-plugin-no-bundle';

export default defineConfig({
  build: {
    lib: {
      formats: ['es', 'cjs'],
      entry: 'src/main.ts',
    },
  },
  plugins: [noBundle()],
});
