# vite-plugin-no-bundle

Use Vite in library mode while skipping the bundling phase.

## Motivation

With the rise in monorepos and native ESM support, it is becoming increasingly popular to release
libraries that are meant to be bundled by the consuming application (or even served directly).
The support for library mode in Vite is still lacking when it comes to producing unbundled code,
so this plugin aims to help with this in a few aspects:

- Configure [preserveModules](https://rollupjs.org/guide/en/#outputpreservemodules) to produce unbundled library.
- Automatically mark node modules as [external](https://rollupjs.org/guide/en/#external).
- Option for copying files AS IS, relying instead on the consuming bundler.

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
      internal: 'my-special-node-module',
    }),
  ],
  build: {
    lib: {
      entry: 'src/myEntryPoint.ts', // required
    },
  },
});
```

## Config

**root**

- **Type :** `string`
- **Default :** `src`

The root directory for the library source.
See [output.preserveModulesRoot](https://rollupjs.org/guide/en/#outputpreservemodulesroot).

```js
noBundlePlugin({
  root: 'source',
});
```

**fileNames**

- **Type :** `string | (chunkInfo: ChunkInfo) => string`
- **Default :** `[name].js`

Pattern (or function returning a pattern) for determining the output file names.
See last paragraph of [output.entryFileNames](https://rollupjs.org/guide/en/#outputentryfilenames).

```js
noBundlePlugin({
  fileNames: '[name][extname]',
});
```

**copy**

- **Type :** `string | string[]`
- **Default :** `undefined`

One or more [globs](https://github.com/micromatch/micromatch) for matching files that should not
be handled by Vite, but instead be marked as external and copied to the output directory AS IS.
This is especially useful for static assets such as `.css`, which are otherwise inlined as raw
strings when using Vite in library mode ([issue here](https://github.com/vitejs/vite/issues/4454)).

```js
noBundlePlugin({
  copy: '**/*.css',
});

// someFile.ts
import './styles.css'; // styles.css will be copied to output and import remains unchanged
```

_Keep in mind that building to any other module format than ESM (such as commonjs) will likely
prevent the consuming environment from resolving static assets. For example, Vite relies on
`import.meta` for getting URL's to static assets, which is only valid when using ESM._

**internal**

- **Type :** `string | string[]`
- **Default :** `undefined`

One or more [globs](https://github.com/micromatch/micromatch) for matching files that should NOT
be automatically marked as external.

_Since the plugin automatically marks node modules as external, this config can be used to tell
the plugin to NOT handle certain files (it won't prevent other plugins from resolving them though)._

```js
noBundlePlugin({
  internal: '**/*.cjs',
});
```
