import glob from 'glob';
import { isAbsolute, resolve as resolvePath } from 'node:path';
import type { PluginOption } from 'vite';

/**
 * Entrypoints plugin options.
 */
export interface EntrypointsOptions {
  /**
   * Base directory to resolve entry file patterns from.
   *
   * Relative path is resolved from current working directory.
   *
   * Default is current working directory.
   */
  baseDir?: string;
  /**
   * Glob patterns to match entry files in base directory.
   *
   * A separate entry chunk is created for each matching file.
   */
  entryFilePatterns: string[];
  /**
   * Mapping function to generate entry names for entry files.
   *
   * Must return a string representing the entry name of the file.
   */
  entryNameMapper?: (fileName: string) => string;
}

/**
 * Creates a Vite plugin to generate additional entry points.
 *
 * @param pluginOptions Plugin configuration options.
 * @returns Vite plugin configuration.
 */
export const entrypoints = (
  pluginOptions: EntrypointsOptions
): PluginOption => ({
  name: 'vite-plugin-entrypoints',
  async options(options) {
    if (pluginOptions.entryFilePatterns.length < 1) return;
    const basePath = resolveBasePath(pluginOptions.baseDir);
    const entryFiles = await findEntryFiles(
      pluginOptions.entryFilePatterns,
      basePath
    );
    if (entryFiles.length < 1) return;
    const entrypoints = createEntrypoints(entryFiles, basePath, pluginOptions);
    return {
      ...options,
      input: {
        ...(typeof options.input === 'object' ? options.input : {}),
        ...entrypoints,
      },
    };
  },
});

const resolveBasePath = (baseDir?: string) =>
  baseDir && isAbsolute(baseDir)
    ? baseDir
    : resolvePath(process.cwd(), baseDir || '.');

const findEntryFiles = async (patterns: string[], basePath: string) => {
  const patternMatches = await Promise.all(
    patterns.map((pattern) => findFilesByPattern(pattern, basePath))
  );
  return patternMatches.flatMap((files) => files);
};

const findFilesByPattern = (pattern: string, basePath?: string) =>
  new Promise<string[]>((resolve, reject) => {
    glob(pattern, { cwd: basePath }, (err, matches) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(matches);
    });
  });

const createEntrypoints = (
  entryFiles: string[],
  basePath: string,
  pluginOptions: EntrypointsOptions
) =>
  entryFiles.reduce<Record<string, string>>((entrypoints, entryFile) => {
    const entryName = pluginOptions.entryNameMapper
      ? pluginOptions.entryNameMapper(entryFile)
      : entryFile.replace(/\.[^.]*$/, '');
    entrypoints[entryName] = resolvePath(basePath, entryFile);
    return entrypoints;
  }, {});
