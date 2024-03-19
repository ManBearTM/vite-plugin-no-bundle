import fs from 'fs/promises';
import { beforeAll, it, expect } from 'vitest';
import { build } from 'vite';

let files: string[] = [];

beforeAll(async () => {
  await build({ root: 'samples/copy-assets' });
  files = await fs.readdir('samples/copy-assets/dist');
});

it('should copy assets and build files', () =>
  expect(files).toEqual(['counter.js', 'main.js', 'style.css']));

it('should not modify the style.css file', async () => {
  const source = await fs.readFile('samples/copy-assets/src/style.css', 'utf-8');
  const dest = await fs.readFile('samples/copy-assets/dist/style.css', 'utf-8');
  expect(source).toEqual(dest);
});
