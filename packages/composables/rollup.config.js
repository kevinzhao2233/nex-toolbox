import esbuild from 'rollup-plugin-esbuild';
import { cleandir } from 'rollup-plugin-cleandir';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.es.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [esbuild({ target: 'es2018' }), cleandir('dist')],
    external: ['vue'],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts({
      compilerOptions: {
        preserveSymlinks: false,
      },
    })],
    external: ['vue'],
  },
];
