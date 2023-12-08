import minimatch from 'minimatch';
import { access, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve as resolvePath } from 'node:path';
import type { NormalizedOutputOptions, OutputAsset, OutputChunk } from 'rollup';
import type { PluginOption } from 'vite';

/**
 * Output chunk information.
 */
export interface ChunkInfo {
  /**
   * Directory containing the chunk file.
   */
  dir: string;
  /**
   * Name of the chunk file.
   */
  file: string;
  /**
   * Rollup output options.
   */
  options: NormalizedOutputOptions;
  /**
   * Rollup chunk information.
   */
  chunk: OutputChunk;
}

/**
 * Generate package.json plugin options.
 */
export interface GeneratePackageJsonOptions {
  /**
   * Glob patterns to match chunk file names to generate package.json for.
   *
   * A package.json file will be created if chunk file name matches at least one
   * of the given patterns.
   */
  chunkFilePatterns: string[];
  /**
   * Additional entries for generated package.json files.
   *
   * Can be a static object or a function returning an object or promised object.
   */
  additionalEntries?:
    | Record<string, unknown>
    | ((
        info: ChunkInfo
      ) => Record<string, unknown> | Promise<Record<string, unknown>>);
}

/**
 * Creates a Vite plugin to generate package.json files for output chunks.
 *
 * @param pluginOptions Plugin configuration options.
 * @returns Vite plugin configuration.
 */
export const generatePackageJson = (
  pluginOptions: GeneratePackageJsonOptions
): PluginOption => ({
  name: 'vite-plugin-generate-package-json',
  async writeBundle(options, bundle) {
    const outputChunks = Object.values(bundle)
      .filter(isChunk)
      .filter((outputChunk) =>
        isMatchingFileNamePattern(outputChunk, pluginOptions.chunkFilePatterns)
      );
    await Promise.all(
      outputChunks.map((outputChunk) =>
        writePackageJson(outputChunk, options, pluginOptions)
      )
    );
  },
});

const isChunk = (output: OutputChunk | OutputAsset): output is OutputChunk =>
  output.type === 'chunk';

const isMatchingFileNamePattern = (
  outputChunk: OutputChunk,
  patterns: string[]
) => patterns.some((pattern) => minimatch(outputChunk.fileName, pattern));

const writePackageJson = async (
  outputChunk: OutputChunk,
  outputOptions: NormalizedOutputOptions,
  pluginOptions: GeneratePackageJsonOptions
) => {
  const outputPath = resolvePath(outputOptions.dir, outputChunk.fileName);
  const outputDir = dirname(outputPath);
  const outputFile = basename(outputChunk.fileName);
  const packageJsonPath = resolvePath(outputDir, 'package.json');
  const isPackageJsonPresent = await access(packageJsonPath)
    .then(() => true)
    .catch(() => false);

  const packageJson = isPackageJsonPresent
    ? JSON.parse(await readFile(packageJsonPath, 'utf8'))
    : {};

  if (outputOptions.format === 'es') {
    packageJson.module = `./${outputFile}`;
  } else if (outputOptions.format === 'cjs' || outputOptions.format === 'umd') {
    packageJson.main = `./${outputFile}`;
  }

  if (typeof pluginOptions.additionalEntries === 'function') {
    Object.assign(
      packageJson,
      await pluginOptions.additionalEntries({
        dir: outputDir,
        file: outputFile,
        options: outputOptions,
        chunk: outputChunk,
      })
    );
  } else if (pluginOptions.additionalEntries) {
    Object.assign(packageJson, pluginOptions.additionalEntries);
  }

  await writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, undefined, 2),
    'utf8'
  );
};
