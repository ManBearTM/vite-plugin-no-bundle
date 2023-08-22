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

## Installation

![npm](https://img.shields.io/static/v1?style=for-the-badge&message=npm&color=CB3837&logo=npm&logoColor=FFFFFF&label=)

This plugin is designed to work with Vite in a development environment using
Node.js. You can install this package using npm, [Yarn], or [pnpm] using a
command similar to this example for npm:

```sh
npm install -D vite-plugin-no-bundle
```

## Usage

![Vite](https://img.shields.io/static/v1?style=for-the-badge&message=Vite&color=646CFF&logo=Vite&logoColor=FFFFFF&label=)

📜 In accordance with [Vite plugin convention], we provide a default export
function that takes in a bunch of customization options.

📚 You can find the complete list of options below! 👇

```js
import { defineConfig } from 'vite';
import noBundlePlugin from 'vite-plugin-no-bundle';

export default defineConfig({
  build: {
    lib: {
      formats: ['es'],
      entry: 'src/index.ts',
    },
  },
  plugins: [noBundlePlugin({ copy: '**/*.css' })],
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
  root?: string; //= 'src'
}
```

- **`copy`:** One or more [globs] for matching files that should not be handled
  by Vite, but instead be marked as external and copied to the output directory
  **as is**. This is especially useful for static assets such as `.css`, which
  are otherwise inlined as raw strings when using Vite in library mode
  ([vitejs/vite#4454]).

- **`internal`:** One or more [globs] for matching files that should **not** be
  automatically marked as external. This can be used to tell the plugin to
  **not** handle certain files and leave them up to other plugins & resolvers.

- **`root`:** Exposes [`output.preserveModulesRoot`], which controls which part
  of the full path to exclude when putting files into the `dist/` folder. Make
  sure to change this if you're using something other than `src/` for your
  source code.

### Customizing file names

In previous versions of this plugin, it was possible to customize the generated
file names via the `fileNames` option. This has been removed in favor of Vite's
own `build.lib.fileName` option. By default, this plugin uses `[name]` as the
`fileName`, resulting in files keeping their original name with the appropriate
extension appended based on module format. This change was implemented to allow
multiple module formats to be emitted using this plugin. Example configuration:

```js
import { defineConfig } from 'vite';
import noBundlePlugin from 'vite-plugin-no-bundle';

export default defineConfig({
  build: {
    lib: {
      formats: ['es', 'cjs'], // Generate multiple formats without bundling
      fileName: 'my-lib-[name]', // Extension automatically determined by format
      entry: 'src/index.ts',
    },
  },
  plugins: [noBundlePlugin({ copy: '**/*.css' })],
});
```

### Use cases

You can use this plugin to force Vite to leave your custom fine-tuned file
structure alone. This is especially useful when consuming just _part_ of a
module directly via a deep import. For instance, if you have two Vite projects,
one library and one app, the library could use this plugin so that the app is
able to bundle everything together **on its own terms**. 🎁

Another good use-case is serving individual files via an HTTP server. Sometimes
you just want a plain TS ➡️ JS file conversion (with some extra features). This
plugin lets you do just that, no magic required. 🧙‍♂️

## Development

![TypeScript](https://img.shields.io/static/v1?style=for-the-badge&message=TypeScript&color=3178C6&logo=TypeScript&logoColor=FFFFFF&label=)

This is a fairly basic Vite plugin. The only compilation step is to run
`npm run build` which uses [tsup].

If you're interested in learning more about Vite plugins and how they work,
check out the [Plugin API | Vite] page!

<!-- prettier-ignore-start -->
[vite]: https://vitejs.dev/
[vite plugin convention]: https://vitejs.dev/guide/api-plugin.html#simple-examples
[`output.preserveModulesRoot`]: https://rollupjs.org/guide/en/#outputpreservemodulesroot
[globs]: https://github.com/micromatch/micromatch#readme
[vitejs/vite#4454]: https://github.com/vitejs/vite/issues/4454
[tsup]: https://github.com/egoist/tsup#readme
[Plugin API | Vite]: https://vitejs.dev/guide/api-plugin.html
[@ManBearTM]: https://github.com/ManBearTM
[yarn]: https://yarnpkg.com/
[pnpm]: https://pnpm.io/
<!-- prettier-ignore-end -->
