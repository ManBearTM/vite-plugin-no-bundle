import fs from 'fs/promises';
import { beforeAll, it, expect } from 'vitest';
import { build } from 'vite';

let src: string[] = [];
let node_modules: string[] = [];

beforeAll(async () => {
  await build({ root: 'samples/internal-files' });
  src = await fs.readdir('samples/internal-files/dist/src');
  node_modules = await fs.readdir('samples/internal-files/dist/node_modules');
});

it('should include source files', async () => expect(src).toEqual(['App.js', 'main.js']));
it('should include internal files', async () => expect(node_modules).toEqual(['react-dom']));
