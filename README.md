# vite-plugin-no-bundle

## Install
```bash
# npm
npm i -D vite-plugin-no-bundle

# yarn
yarn add -D vite-plugin-no-bundle
```

## Usage
```js
import { defineConfig } from 'vite';
import noBundlePlugin from 'vite-plugin-no-bundle';

export default defineConfig({
  plugins: [
    noBundlePlugin({
      root: 'source',
      fileNames: '[name].mjs',
      copy: '**/*.css',
      internal: 'my-special-node-module'
    })
  ],
});
```

## Config

**root**

- **Type :** `string`
- **Default :** `src`

The root directory for the library source.
See [output.preserveModulesRoot](https://rollupjs.org/guide/en/#outputpreservemodulesroot).

```js
import { defineConfig } from 'vite';
import noBundlePlugin from 'vite-plugin-no-bundle';

export default defineConfig({
  plugins: [
    noBundlePlugin({
      root: 'source',
    })
  ],
});
```

**fileNames**

- **Type :** `string | (chunkInfo: ChunkInfo) => string` 
- **Default :** `[name].js`

Pattern (or function returning a pattern) for determining the output file names.
See last paragraph of [output.entryFileNames](https://rollupjs.org/guide/en/#outputentryfilenames).

```js
import { defineConfig } from 'vite';
import noBundlePlugin from 'vite-plugin-no-bundle';

export default defineConfig({
  plugins: [
    noBundlePlugin({
      fileNames: '[name][extname]',
    })
  ],
});
```

**copy**

- **Type :** `string | string[]` 
- **Default :** `undefined`

One or more [globs](https://github.com/micromatch/micromatch) for matching files that should not
be handled by Vite, but instead be marked as external and copied to the output directory AS IS.
This is especially useful for static assets such as `.css`, which is otherwise inlined as a raw
strings when using Vite in library mode ([issue here](https://github.com/vitejs/vite/issues/4454)).

```js
import { defineConfig } from 'vite';
import noBundlePlugin from 'vite-plugin-no-bundle';

export default defineConfig({
  plugins: [
    noBundlePlugin({
      copy: '**/*.css',
    })
  ],
});
```

**internal**

- **Type :** `string | string[]` 
- **Default :** `undefined`

One or more [globs](https://github.com/micromatch/micromatch) for matching files that should NOT
be automatically marked as external.

_Since the plugin automatically marks node modules as external, this config can be used to tell
the plugin to NOT handle certain files (it won't prevent other plugins from resolving them though)._

```js
import { defineConfig } from 'vite';
import noBundlePlugin from 'vite-plugin-no-bundle';

export default defineConfig({
  plugins: [
    noBundlePlugin({
      copy: '**/*.css',
    })
  ],
});
```