import fs from 'fs/promises';
import { beforeAll, it, expect } from 'vitest';
import { build } from 'vite';

let files: string[] = [];

beforeAll(async () => {
  await build({ root: 'samples/multiple-formats' });
  files = await fs.readdir('samples/multiple-formats/dist');
});

it('should build files in multiple formats', () =>
  expect(files).toEqual(['counter.cjs', 'counter.js', 'main.cjs', 'main.js']));
