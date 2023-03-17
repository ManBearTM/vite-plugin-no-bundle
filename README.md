# No-bundle for Vite

⚡ Use [Vite] for building without the bundling part

<div align="center">

![](https://i.imgur.com/whutZeK.png)

</div>

🧰 Useful for monorepos \
📦 Can be consumed by native ESM tooling \
👷‍♂️ Lets consumers deep import specific files \
✍ You control your own code splitting

With the rise in monorepos and native ESM support, it is becoming increasingly
popular to release libraries that are meant to be bundled by the consuming
application or even served directly. The support for library mode in Vite is
still lacking when it comes to producing unbundled code, so this plugin fills in
some of those gaps. 🚀

## Install

This plugin is designed to work with Vite in a development environment using
Node.js. You can install this package using npm, [Yarn], or [pnpm] using a
command similar to this example for npm:

```sh
npm install -D vite-plugin-no-bundle
```

## Usage

📜 In accordance with [Vite plugin convention], we provide a default export
function that takes in a bunch of customization options.

📚 You can find the complete list of options below! 👇

```js
import { defineConfig } from "vite";
import noBundlePlugin from "vite-plugin-no-bundle";

export default defineConfig({
  build: {
    lib: {
      formats: ["es"],
      entry: "src/index.ts",
    },
  },
  plugins: [noBundlePlugin({ copy: "**/*.css" })],
});
```

Here's an example project tree using ☝ the example `vite.config.ts` from above:

```
.
├── dist/
│   ├── index.js
│   ├── card.css
│   ├── table.css
│   ├── createTable.js
│   └── fetchData.js
├── src/
│   ├── index.ts
│   ├── card.css
│   ├── table.css
│   ├── createTable.js
│   └── fetchData.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

⚠️ Keep in mind that non-ESM output (such as CommonJS) will probably prevent the
consumer from resolving static assets. Vite relies on `import.meta` for getting
a URL's to static assets, which is only valid when using ESM.

### Options

```ts
interface VitePluginNoBundleOptions {
  copy?: string | string[];
  internal?: string | string[];
  fileNames?: string | (c: ChunkInfo) => string; //= '[name].js'
  root?: string; //= 'src'
};
```

- **`copy`:** One or more [globs] for matching files that should not be handled
  by Vite, but instead be marked as external and copied to the output directory
  **as is**. This is especially useful for static assets such as `.css`, which
  are otherwise inlined as raw strings when using Vite in library mode
  ([vitejs/vite#4454]).

- **`internal`:** One or more [globs] for matching files that should **not** be
  automatically marked as external. This can be used to tell the plugin to
  **not** handle certain files and leave them up to other plugins & resolvers.

- **`fileNames`:** A pattern (or a function returning a pattern) for determining
  the output file names. You can use any string substitutions described in
  [`output.entryFileNames`] from Rollup.

- **`root`:** Exposes [`output.preserveModulesRoot`], which controls which part
  of the full path to exclude when putting files into the `dist/` folder. Make
  sure to change this if you're using something other than `src/` for your
  source code.

### Use cases

TODO: Add use cases

<!-- prettier-ignore-start -->
[vite]: https://vitejs.dev/
[vite config]: https://vitejs.dev/config/
[vite plugin convention]: https://vitejs.dev/guide/api-plugin.html#simple-examples:~:text=It%20is%20common%20convention%20to%20author%20a%20Vite/Rollup%20plugin%20as%20a%20factory%20function%20that%20returns%20the%20actual%20plugin%20object.%20The%20function%20can%20accept%20options%20which%20allows%20users%20to%20customize%20the%20behavior%20of%20the%20plugin.
[`output.preserveModulesRoot`]: https://rollupjs.org/guide/en/#outputpreservemodulesroot
[`output.entryFileNames`]: https://rollupjs.org/guide/en/#outputentryfilenames
[globs]: https://github.com/micromatch/micromatch#readme
[vitejs/vite#4454]: https://github.com/vitejs/vite/issues/4454
<!-- prettier-ignore-end -->
