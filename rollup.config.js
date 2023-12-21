import commonjs from '@rollup/plugin-commonjs'; // Convert CommonJS modules to ES6
import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from '@rollup/plugin-buble'; // Transpile/polyfill with reasonable browser support
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'packages/index.js',
    output: {
        name: 'VuePdfEditor',
        exports: 'named',
    },
    plugins: [
        commonjs(),
        vue({
            css: true, // Dynamically inject css as a <style> tag
            compileTemplate: true, // Explicitly convert template to render function
        }),
        buble({
          objectAssign: 'Object.assign',
            transforms: {
                asyncAwait: false,
              },
         }), // Transpile to ES5
        postcss({
            minimize: true,
            modules: true,
            use: {
                sass: null,
                stylus: null,
           }, 
            extract: true
        }),
    ],
};
