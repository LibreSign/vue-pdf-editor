/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue2';
import { resolve } from 'node:path';
import type { ModuleFormat } from 'rollup';
import { defineConfig } from 'vite';
import { entrypoints } from './build/entrypoints';
import { generatePackageJson } from './build/generate-package-json';
import packageJson from './package.json';

// More on Vite configuration: https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // More on Vue.js plugin: https://github.com/vitejs/vite-plugin-vue2
    vue(),
    // Generate separate chunks for components to enable code splitting.
    entrypoints({
      baseDir: resolve(__dirname, 'src'),
      entryFilePatterns: ['components/**.vue'],
    }),
    // Generate package.json for each separate component chunk.
    generatePackageJson({
      chunkFilePatterns: ['components/**/index.*'],
      additionalEntries: { private: true, types: './index.d.ts' },
    }),
  ],
  build: {
    // More on Vite library mode: https://vitejs.dev/guide/build.html#library-mode
    lib: {
      entry: { index: resolve(__dirname, 'src/index.ts') },
      name: 'VuePDFEditor',
    },
    minify: false,
    target: ['chrome80', 'edge80', 'firefox80', 'safari12'],
    rollupOptions: {
      // Externalize all runtime/peer dependencies declared in package.json
      // More on external modules: https://rollupjs.org/guide/en/#external
      external: [
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.peerDependencies || {}),
      ],
      // Output as ES modules (*.js) and CommonJS modules (*.cjs)
      // More on rollup.js output: https://rollupjs.org/guide/en/#configuration-files
      output: (['es', 'cjs'] as ModuleFormat[]).map((format) => ({
        format,
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: `chunks/[name].${format}.js`,
        entryFileNames: `[name].${format}.js`,
        // Disable import hoisting to facilitate tree-shaking.
        hoistTransitiveImports: false,
        // Enable helper functions for default/namespace imports in CommonJS output.
        interop: 'auto',
      })),
    },
  },
  // More on Vitest configuration: https://vitest.dev/config/
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'istanbul',
    },
  },
});
