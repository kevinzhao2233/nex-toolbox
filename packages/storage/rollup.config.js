import typescript from '@rollup/plugin-typescript';
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
    plugins: [typescript({ compilerOptions: { target: 'es6' } }), cleandir('dist')],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
