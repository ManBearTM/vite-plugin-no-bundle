import fs from 'fs/promises';
import path from 'path';
import { beforeAll, it, expect } from 'vitest';
import { build } from 'vite';

const root = path.resolve(__dirname, '../samples/multiple-formats');

let files: string[] = [];

beforeAll(async () => {
  await build({ root });
  files = await fs.readdir(`${root}/dist`);
});

it('should build files in multiple formats', () =>
  expect(files).toEqual(['counter.cjs', 'counter.js', 'main.cjs', 'main.js']));
