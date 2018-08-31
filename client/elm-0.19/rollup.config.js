// import babel from 'rollup-plugin-babel';
// import svelte from 'rollup-plugin-svelte';
// import resolve from 'rollup-plugin-node-resolve';
// import { terser } from 'rollup-plugin-terser';
import elm from 'rollup-plugin-elm';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/main.js',
        format: 'iife',
        name: 'main.js',
        sourcemap: true,
    },
    plugins: [
        elm({
            include: 'src/**/*.elm',
            exclude: 'elm-stuff',
            compiler: {
                optimize: true,
            }
        }),
    ],
};