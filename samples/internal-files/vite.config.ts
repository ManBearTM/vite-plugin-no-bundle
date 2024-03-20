import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import noBundle from '../../src/index';

export default defineConfig({
  build: {
    lib: {
      formats: ['es'],
      entry: 'src/main.tsx',
    },
  },
  plugins: [react(), noBundle({ internal: 'react-dom/**' })],
});
