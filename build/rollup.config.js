import vue from 'rollup-plugin-vue2'
import css from 'rollup-plugin-css-only'
import { babel } from '@rollup/plugin-babel';
import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
    input: 'packages/vue-pdf-editor/src/PDFEditor.vue',
    output: {
        name: 'PDFEditor',
        format: 'es'
        exports: 'named',
    },
    plugins: [
        vue({
            css:true,
        }),
        css(),
    ],
};
