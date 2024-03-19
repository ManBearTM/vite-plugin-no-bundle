import { defineConfig } from 'vite';
import noBundle from 'vite-plugin-no-bundle';

export default defineConfig({
  build: {
    lib: {
      formats: ['es'],
      entry: 'src/main.ts',
    },
  },
  plugins: [noBundle({ copy: '**/*.css' })],
});
