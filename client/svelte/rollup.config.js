import babel from 'rollup-plugin-babel';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/main.js',
        format: 'iife',
        name: 'main.js',
        sourcemap: true,
    },
    plugins: [
        svelte({
            // By default, all .html and .svelte files are compiled
            extensions: ['.html'],

            // You can restrict which files are compiled
            // using `include` and `exclude`
            include: 'src/components/**.html',
        }),
        babel({
            include: ['./src/**/*.js'],
        }),
        terser(),
    ],
};