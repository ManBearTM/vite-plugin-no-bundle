import { defineConfig } from 'vite';
import noBundle from '../../src/index';

export default defineConfig({
  build: {
    lib: {
      formats: ['es', 'cjs'],
      entry: 'src/main.ts',
    },
  },
  plugins: [noBundle()],
});
