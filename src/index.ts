import path from 'path';
import fs from 'fs';
import micromatch from 'micromatch';
import fg from 'fast-glob';
import type { Plugin, Rollup } from 'vite';

/** Checks if the provided `id` refers to a node module. */
function isNodeModule(id: string) {
  // Relative and absolute paths will almost always be
  // resolvable using the file system, so require.resolve
  // is not a reliable method for those types of import.
  if (id.startsWith('.') || path.isAbsolute(id)) {
    return id.includes('/node_modules/');
  }

  try {
    // If the `id` is neither relative nor absolute, AND is
    // resolvable by Node, then it has to be a node module.
    require.resolve(id);
    return true;
  } catch (_) {
    // Failing to resolve here could mean the `id` is
    // meant to be resolved by a different plugin.
    return false;
  }
}

interface Config {
  /** @see https://rollupjs.org/guide/en/#outputpreservemodulesroot */
  root?: string;
  /** @see https://rollupjs.org/guide/en/#outputentryfilenames */
  fileNames?: string | ((chunkInfo: Rollup.PreRenderedChunk) => string);
  /** Glob(s) for marking files as external while copying them to the output. */
  copy?: string | string[];
  /** Glob(s) for marking files as non-external, preserving them in the output. */
  internal?: string | string[];
}

export default function plugin(config?: Config): Plugin {
  const preserveModulesRoot = config?.root ?? 'src';
  const entryFileNames = config?.fileNames ?? '[name].js';

  // Store the resolved absolute root path
  let root: string;

  // Create a matcher function from provided internal config (if any)
  const isInternal = (file: string) =>
    config?.internal ? micromatch.isMatch(file, config.internal) : false;

  // Create a matcher function from provided copy config (if any)
  const isCopyTarget = (file: string) =>
    config?.copy ? micromatch.isMatch(file, config.copy) : false;

  return {
    name: 'no-bundle',
    enforce: 'pre',
    apply: 'build',

    config() {
      return {
        build: {
          rollupOptions: {
            output: {
              preserveModules: true,
              preserveModulesRoot,
              entryFileNames,
            },
          },
        },
      };
    },

    configResolved(resolvedConfig) {
      root = resolvedConfig.root;
    },

    async buildStart() {
      if (config?.copy) {
        const cwd = preserveModulesRoot ? path.join(root, preserveModulesRoot) : root;
        const files = await fg(config.copy, { cwd });
        files.forEach(file => {
          this.emitFile({
            type: 'asset',
            source: fs.readFileSync(path.join(cwd, file)),
            fileName: file,
          });
        });
      }
    },

    async resolveId(source, importer, options: any) {
      // Remove any query parameters
      const [id] = source.split('?');

      if (options.isEntry) return null;
      if (!importer) return null;
      if (isInternal(id)) return null;
      if (isNodeModule(id)) return { id, external: true };

      // Treat absolute paths as starting from project root
      const absolutePath = path.isAbsolute(id)
        ? path.join(root, id)
        : path.join(path.dirname(importer), id);

      // Get the relative path starting from `root`
      const relativePath = path.relative(root, absolutePath);

      // Mark the source as external and with side effects if it matches a glob pattern,
      // excluding it from the build. The file is then emitted manually in buildStart.
      if (isCopyTarget(relativePath)) {
        return {
          // Enforce relative path to avoid issues with preserveModulesRoot
          id: path.isAbsolute(id) ? path.relative(path.dirname(importer), absolutePath) : id,
          external: true,
          moduleSideEffects: true,
        };
      }

      return null;
    },
  };
}
