import fs from 'fs/promises';
import path from 'path';
import { beforeAll, it, expect } from 'vitest';
import { build } from 'vite';

const root = path.resolve(__dirname, '../samples/copy-assets');

let files: string[] = [];

beforeAll(async () => {
  await build({ root });
  files = await fs.readdir(`${root}/dist`);
});

it('should copy assets and build files', () =>
  expect(files).toEqual(['counter.js', 'main.js', 'style.css']));

it('should not modify the style.css file', async () => {
  const source = await fs.readFile(`${root}/src/style.css`, 'utf-8');
  const dest = await fs.readFile(`${root}/dist/style.css`, 'utf-8');
  expect(source).toEqual(dest);
});
