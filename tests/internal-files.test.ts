import fs from 'fs/promises';
import path from 'path';
import { beforeAll, it, expect } from 'vitest';
import { build } from 'vite';

const root = path.resolve(__dirname, '../samples/internal-files');

let src: string[] = [];
let node_modules: string[] = [];

beforeAll(async () => {
  await build({ root });
  src = await fs.readdir(`${root}/dist/src`);
  node_modules = await fs.readdir(`${root}/dist/node_modules`);
});

it('should include source files', async () => expect(src).toEqual(['App.js', 'main.js']));
it('should include internal files', async () => expect(node_modules).toEqual(['react-dom']));
