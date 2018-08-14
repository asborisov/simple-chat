import babel from 'rollup-plugin-babel';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
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
        resolve(),
        svelte({
            include: 'src/**.svelte',
            css: (css) => {
                css.write('dist/main.css');
            }
        }),
        babel({
            include: ['./src/**/*.js'],
        }),
        terser(),
    ],
};