import { Plugin } from 'vite';
interface Config {
    /** @see https://rollupjs.org/guide/en/#outputpreservemodulesroot */
    root?: string;
    /** @see https://rollupjs.org/guide/en/#outputentryfilenames */
    fileNames?: string;
    /** Glob(s) for marking files as external while copying them to the output. */
    copy?: string | string[];
    /** Glob(s) for marking files as non-external, preserving them in the output. */
    internal?: string | string[];
}
export default function plugin(config?: Config): Plugin;
export {};
